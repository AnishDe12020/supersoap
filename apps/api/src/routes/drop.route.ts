import { Router } from "express";
import { authHandler } from "middlewares/authHandler";
import multer from "multer";

import {
  createDropHandler,
  patchDropHandler,
  solanaPayHandler,
} from "@controllers/drop.controller";
import {
  mintHandler,
  solanaPayMintHandler,
} from "@controllers/mint.controller";

const dropRouter = Router();
const mutlerUpload = multer({
  dest: "temp/",
});

dropRouter.post(
  "/",
  authHandler,
  mutlerUpload.single("image"),
  createDropHandler
);

dropRouter.patch("/:id", authHandler, patchDropHandler);

dropRouter.post("/:id/mint", mintHandler);

dropRouter.get("/:id/solana-pay", solanaPayHandler);

dropRouter.post("/:id/solana-pay", solanaPayMintHandler);

export default dropRouter;
