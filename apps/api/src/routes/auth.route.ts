import { Router } from "express";
import { handleAuth } from "@controllers/auth.controller";
import { authHandler } from "middlewares/authHandler";

const authRouter = Router();

authRouter.post("/", authHandler, handleAuth);

export default authRouter;
