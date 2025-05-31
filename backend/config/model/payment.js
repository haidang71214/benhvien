
import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;

const paymentSchema = new Schema({
    tranSactionNo:String,
    amount:Number,
    payMethod:{
      enum:['VNPay,cash'], // trả tiền mặt hoặc vnpay
      type:String,
      require:false,
      default:'VNPay'
    },
    response_code:String,
    payment_date: Date,
    vnp_PayDate: Date,
    vnp_TransactionStatus: String,
    patientId:{
      type:Types.ObjectId,
      ref:'User',
      required:true
    }
})
// lịch hẹn


const payments = mongoose.model('payments',paymentSchema)
export default payments