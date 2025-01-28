import crypto from "crypto";

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import {makeFlutterWavePayment} from '../controllers/flutterWaveOrderController.js'


export async function makeOrder(req, res) {
    try{
        // using user id get user information from db
        const user = await userModel.findById(req.body.userId);

        // unique transaction reference number used to identify the flutterwave payment made of an order
        const transactionRefrenceNo = crypto.randomBytes(20).toString("hex");

        // create order storing user cart items in db this order will also contain the unique transaction reference number
        await orderModel.create({
            transaction_ref:transactionRefrenceNo,
            userId: req.body.userId,
            items: req.body.items,
            amount:req.body.amount,
            address:req.body.address,
        });
        
        // clear cart
        await userModel.findByIdAndUpdate(req.body.userId, {$set: {cartData: {}} });

        // initiate payment using user details, amount and unique transaction reference number
        const paymentData = await makeFlutterWavePayment(
            transactionRefrenceNo,
            user.email,
            Number(req.body.amount),
            user.name,
          );

          return res.status(200).json({message:"Order successfully placed",payment:paymentData});
    }catch(error){
        console.error(error);
        return res.status(503).send()
    }
}