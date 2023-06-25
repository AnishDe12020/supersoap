import { Router } from "express";
import { authHandler } from "middlewares/authHandler";
import multer from "multer";

import {
  createDropHandler,
  patchDropHandler,
} from "@controllers/drop.controller";
import { mintHandler } from "@controllers/mint.controller";

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

export default dropRouter;
