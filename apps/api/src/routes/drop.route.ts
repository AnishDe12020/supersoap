import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  TransactionResponse,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Router } from "express";
import { authHandler } from "middlewares/authHandler";
import multer from "multer";
import {
  calculateClosestTreeDepth,
  getCreateCollectionTx,
  getCreateTreeTx,
} from "utils/compression";
import base58 from "bs58";
import config from "config";
import { uploadMutlerFile, uploadObject } from "utils/uploadImage";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import { getConcurrentMerkleTreeAccountSize } from "@solana/spl-account-compression";
import prismaClient from "config/prisma";
import logger from "middlewares/logger";

const dropRouter = Router();
const mutlerUpload = multer({
  dest: "temp/",
});

dropRouter.get("/", authHandler, async (req, res) => {
  const drops = await prismaClient.drop.findMany({
    where: {
      owner: {
        address: req.user,
      },
    },
  });

  res.json({ drops });
});

// create a drop
dropRouter.post(
  "/",
  authHandler,
  mutlerUpload.single("image"),
  async (req, res) => {
    console.log(req.file);
    console.log(req.body);

    if (!req.file) {
      res.status(400).json({ message: "no file uploaded" });
      return;
    }

    const {
      name,
      description,
      external_url,
      attributes,
      network,
      size,
      depositSig,
    } = req.body;

    if (!name || !network || !size || !depositSig) {
      res.status(400).json({ message: "missing required fields" });
      return;
    }

    const connection = new Connection(
      network === "mainnet-beta" ? config.rpc : clusterApiUrl("devnet")
    );

    const keypair = Keypair.fromSecretKey(base58.decode(config.privateKey));

    const depth = calculateClosestTreeDepth(size);

    const requiredSpace = getConcurrentMerkleTreeAccountSize(
      depth.sizePair.maxDepth,
      depth.sizePair.maxBufferSize,
      depth.canopyDepth
    );

    const estimatedCostForTree =
      (await connection.getMinimumBalanceForRentExemption(requiredSpace)) /
      LAMPORTS_PER_SOL;

    const txCost = size * 0.000005;

    const totalWithoutPadding = estimatedCostForTree + txCost;
    const padding = totalWithoutPadding * 0.1;
    const total = totalWithoutPadding + padding;

    const tx = (await connection.getTransaction(depositSig, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 2,
    })) as TransactionResponse;

    if (!tx) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction: tx not found",
      });
    }

    if (!tx.meta) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction: tx meta not found",
      });
    }

    const vaultAccountIndex = tx.transaction.message.accountKeys.findIndex(
      (account) => account.toString() === keypair.publicKey.toBase58()
    );

    if (vaultAccountIndex < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction: vault account not found",
      });
    }

    const { preBalances, postBalances } = tx.meta;

    const vaultAccountBalanceChange =
      postBalances[vaultAccountIndex] - preBalances[vaultAccountIndex];

    if (!(vaultAccountBalanceChange >= Math.ceil(total * LAMPORTS_PER_SOL))) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction: insufficient transfer amount",
      });
    }

    const { cid: imageCid, gatewayUri: imageUri } = await uploadMutlerFile(
      req.file
    );

    console.log(depth);

    try {
      const metadata = {
        name: name,
        symbol: "SOAP",
        description: description,
        image: imageUri,
        external_url: external_url,
      };

      const { cid: metadataCid, gatewayUri: metadataUri } = await uploadObject(
        metadata
      );

      const collectionMetadata: CreateMetadataAccountArgsV3 = {
        data: {
          name,
          symbol: "SOAP",
          uri: metadataUri,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: false,
        collectionDetails: null,
      };

      const {
        treeAddress,
        treeAuthority,
        treeKeypair,
        tx: createTreeTx,
      } = await getCreateTreeTx(
        connection,
        depth.sizePair,
        depth.canopyDepth,
        keypair.publicKey
      );

      console.log("treeAddress", treeAddress.toBase58());
      console.log("treeAuthority", treeAuthority.toBase58());
      console.log("treeKeypair", treeKeypair.secretKey);

      const createTreeSig = await sendAndConfirmTransaction(
        connection,
        createTreeTx,
        [keypair, treeKeypair]
      );

      console.log("createTreeSig", createTreeSig);

      const {
        masterEditionAccount,
        metadataAccount,
        mint,
        mintKeypair,
        tokenAccount,
        tx: createCollectionTx,
      } = await getCreateCollectionTx(
        connection,
        keypair.publicKey,
        collectionMetadata,
        size,
        keypair.publicKey
      );

      console.log("masterEditionAccount", masterEditionAccount.toBase58());
      console.log("metadataAccount", metadataAccount.toBase58());
      console.log("mint", mint.toBase58());
      console.log("mintKeypair", mintKeypair.secretKey);
      console.log("tokenAccount", tokenAccount.toBase58());

      const createCollectionSig = await sendAndConfirmTransaction(
        connection,
        createCollectionTx,
        [keypair, mintKeypair]
      );

      console.log("createCollectionSig", createCollectionSig);

      const drop = await prismaClient.drop.create({
        data: {
          collectionMetadataUri: metadataUri,
          imageUri: imageUri,
          masterEditionAccount: masterEditionAccount.toBase58(),
          metadataAccount: metadataAccount.toBase58(),
          mint: mint.toBase58(),
          minted: 0,
          name: name,
          network: network === "mainnet-beta" ? "MAINNET" : "DEVNET",
          attributes: {
            set: JSON.parse(attributes),
          },
          size: Number(size),
          treeAddress: treeAddress.toBase58(),
          active: true,
          description: description,
          externalUrl: external_url,
          owner: {
            connect: {
              address: "8Dyk53RrtmN3MshQxxWdfTRco9sQJzUHSqkUg8chbe88", // hardcoded this, must be derived from the address in jwt body
            },
          },
        },
      });

      res.json({
        message: "drop created",
        id: drop.id,
        createTreeSig,
        createCollectionSig,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

export default dropRouter;
