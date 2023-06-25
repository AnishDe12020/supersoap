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
