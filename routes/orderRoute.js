import express from "express"
import authMiddleware from "../middleware/auth.js";
// import { placeOrder } from "../controllers/orderController.js";
import { makeOrder } from "../controllers/flutterFinal.js";


const orderRouter = express.Router();


orderRouter.post("/place", authMiddleware, makeOrder);

export default orderRouter;