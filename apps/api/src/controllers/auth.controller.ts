import prismaClient from "config/prisma";
import { Request, Response } from "express";
import { validatePubKey } from "utils/validatePubKey";

export const handleAuth = async (req: Request, res: Response) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "address is required" });
  } else if (!validatePubKey(address)) {
    return res.status(400).json({ error: "address is invalid" });
  }

  // find user by address
  const userByAddress = await prismaClient.user.findUnique({
    where: {
      address,
    },
  });

  if (userByAddress) {
    return res.status(200).json({ msg: "user found", user: userByAddress });
  }

  const user = await prismaClient.user.create({
    data: {
      address,
    },
  });

  res.json({ msg: "user created", user });
};
