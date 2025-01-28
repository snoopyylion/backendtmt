import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://tifaseoluwaseyi:Jgagpat67@cluster0.tn1okon.mongodb.net/marketsqare').then(()=>console.log("DB Connection Established"));
}