import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;

// tạo lịch khám hiện tại => tạo cái hồ sơ => tạo thuốc
const appointmentSchema = new Schema({
    doctorId:{type:Types.ObjectId,
      ref:'User',
      required:true
    },
    patientId:{
      type:Types.ObjectId,
      ref:'User',
      required:true
    },
    appointmentTime:Date,
  // lí do cập nhật lịch ?
    reason:String
})
const appointments = mongoose.model('appointments',appointmentSchema)
export default appointments