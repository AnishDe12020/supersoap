import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import base58 from "bs58";
import config from "config";
import prismaClient from "config/prisma";
import { Request, Response } from "express";
import { getMintTx } from "utils/compression";

export const mintHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { claimerAddress } = req.body;

  if (!id) {
    return res.status(400).json({ message: "missing required fields" });
  }

  const drop = await prismaClient.drop.findUnique({
    where: {
      id,
    },
  });

  if (!drop) {
    return res.status(404).json({ message: "drop not found" });
  }

  const keypair = Keypair.fromSecretKey(base58.decode(config.privateKey));

  const connection = new Connection(
    drop.network === "MAINNET" ? config.rpc : clusterApiUrl("devnet")
  );

  if (!drop) {
    return res.status(404).json({ message: "drop not found" });
  }

  if (!drop.active) {
    return res.status(400).json({ message: "drop is not active" });
  }

  const mintTx = getMintTx(
    keypair.publicKey,
    new PublicKey(drop.mint),
    new PublicKey(drop.metadataAccount),
    new PublicKey(drop.masterEditionAccount),
    new PublicKey(drop.treeAddress),
    drop.name,
    drop.imageUri,
    new PublicKey(claimerAddress)
  );

  mintTx.feePayer = keypair.publicKey;

  const txSignature = await sendAndConfirmTransaction(
    connection,
    mintTx,
    [keypair],
    {
      commitment: "confirmed",
      skipPreflight: true,
    }
  );

  await prismaClient.drop.update({
    where: {
      id,
    },
    data: {
      minted: drop.minted + 1,
      Claim: {
        create: {
          claimerAddress,
          claimed: true,
          claimTx: txSignature,
        },
      },
    },
  });

  res.json({
    message: "drop minted",
    txSignature,
  });
};

export const solanaPayMintHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "missing required fields" });
  }

  const { account } = req.body;

  const keypair = Keypair.fromSecretKey(base58.decode(config.privateKey));

  if (!account) {
    return res.status(400).json({
      error: "Missing `account` field in request body",
    });
  }

  const drop = await prismaClient.drop.findUnique({
    where: {
      id,
    },
  });

  if (!drop) {
    return res.status(404).json({ message: "drop not found" });
  }

  if (!drop.active) {
    return res.status(400).json({ message: "drop is not active" });
  }

  const connection = new Connection(
    drop.network === "MAINNET" ? config.rpc : clusterApiUrl("devnet")
  );

  const mintTx = getMintTx(
    keypair.publicKey,
    new PublicKey(drop.mint),
    new PublicKey(drop.metadataAccount),
    new PublicKey(drop.masterEditionAccount),
    new PublicKey(drop.treeAddress),
    drop.name,
    drop.imageUri,
    new PublicKey(account)
  );

  await prismaClient.drop.update({
    where: {
      id,
    },
    data: {
      minted: drop.minted + 1,
      Claim: {
        create: {
          claimerAddress: account,
          claimed: true,
        },
      },
    },
  });

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash({
      commitment: "confirmed",
    });
  mintTx.feePayer = new PublicKey(account);
  mintTx.recentBlockhash = blockhash;
  mintTx.lastValidBlockHeight = lastValidBlockHeight;

  mintTx.partialSign(keypair);

  mintTx.signatures;

  const serializedTransaction = mintTx.serialize({
    requireAllSignatures: false,
  });
  const base64 = serializedTransaction.toString("base64");

  return res.status(200).json({
    transaction: base64,
    message: "mint your nft",
  });
};
