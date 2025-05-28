import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;

// thuốc
const medicineSchema = new Schema({
  type:{
    type:String,
    enum:[] // viên nén,siro
  },
  description:{
    type:String
  }, // mô tả công dụng thuốc,
  quantities:Number, // tổng số lượng
  warning:String // cảnh báo, cấm chỉ định 
})


const medicines = mongoose.model('medicines',medicineSchema)
export default medicines