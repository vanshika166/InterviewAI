import mongoose from 'mongoose';


const paymentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount:Number,
    success:{
        type:Boolean,
        default:false
    },
    transationId:String
},{timestamps:true})

const payment =  mongoose.model("Payment",paymentSchema);

export default payment;