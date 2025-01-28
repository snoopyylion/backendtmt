import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order from frontend
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173/";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount:req.body.amount,
            address:req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});

        const line_items = req.body.items.map((item) => ({
            price_data:{
                currency:"cad",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*1.36
            },
            quantity:item.quantity
        }))


        line_items.push({
            price_data:{
                currency:"cad",
                product_data:{
                    name:"Delivery Charge"
                },
                unit_amount:3000*100*1.36
            },
            quantity:1
        })
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error placing order"})
    }
}

const verifyOrder = async (req,res) => {
    const { orderId, succes} = req.body;
    try {
        if (succes =="true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            res.json({success:true, message:"Payment successful"})
    }else{
        await orderModel.findByIdAndDelete(orderId);
    }
     catch (error) {
        
    }
}
export {placeOrder, verifyOrder}
