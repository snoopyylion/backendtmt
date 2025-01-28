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
          user.name
        );
        const payload = req.transaction_ref;
        const response = await paymentData.Transaction.verify({ id: payload.id });
        if (
          response.data.status === "successful" &&
          response.data.amount === expectedAmount &&
          response.data.currency === expectedCurrency
        ) {
          // Success! Confirm the customer's payment
          return res.status(200).json({message:"Order successfully placed",payment:paymentData});
        } else {
          // Inform the customer their payment was unsuccessful
        }
    }catch(error){
        console.error(error);
        return res.status(503).send()
    }
}
export async function verifyPayment(req, res) {
    // If you specified a secret hash, check for the signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];
    if (!signature || (signature !== secretHash)) {
        // This request isn't from Flutterwave; discard
        res.status(401).end();
    }
    const payload = req.body;
    // It's a good idea to log all received events.
    log(payload);
    // Do something (that doesn't take too long) with the payload
    res.status(200).end()
}
