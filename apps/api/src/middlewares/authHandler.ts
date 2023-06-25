import type { NextFunction, Request, Response } from "express";
import logger from "./logger";
import { verify } from "utils/verifyJWT";
import config from "config";

export const authHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["next-auth.session-token"];

  const secret = config.jwt.access_token.secret;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    verify(token, secret)
      .then((decoded) => {
        req.user = decoded?.name!;
        next();
      })
      .catch((err) => {
        logger.error(err);
        res.status(401).json({ error: "Unauthorized" });
      });
  }
};
