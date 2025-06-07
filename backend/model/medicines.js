import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;
export const MEDICINE_ENUM = ['tablet', 'syrup', 'capsule', 'ointment']// vien nen, siro, vien nang, thuoc mo
// thuốc
const medicineSchema = new Schema({
   name:{type:String,
   required:true
},
  type:{
    type:String,
    enum: MEDICINE_ENUM,
  },
  description:{
    type:String,
    required:true
  }, // mô tả công dụng thuốc,
  quantities:{
   type:Number,
   required:true
  }, // tổng số lượng
  warning:String // cảnh báo, cấm chỉ định 
})


const medicines = mongoose.model('medicines',medicineSchema)
export default medicines