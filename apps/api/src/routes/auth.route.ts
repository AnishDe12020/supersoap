import { Router } from "express";
import { handleAuth } from "@controllers/auth.controller";

const authRouter = Router();

authRouter.post("/", handleAuth);

export default authRouter;
