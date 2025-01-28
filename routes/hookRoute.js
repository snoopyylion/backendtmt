import express from "express"
import authMiddleware from "../middleware/auth.js";
import { handleWebhook } from "../controllers/webHook.js";


const hookRouter = express.Router();


hookRouter.post("/webhook", authMiddleware, handleWebhook);

export default hookRouter;