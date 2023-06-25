import { Router } from "express";
import { authHandler } from "middlewares/authHandler";
import multer from "multer";

const dropRouter = Router();
const upload = multer({
  dest: "temp/",
});

// create a drop
dropRouter.post("/", authHandler, upload.single("file"));

export default dropRouter;
