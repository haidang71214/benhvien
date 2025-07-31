import mongoose from 'mongoose';
import { DOCTOR_HEHE } from './user.js';

//  mỗi người được làm 1 lần
//  admin sẽ accept cái role đó có được chuyển thành bác sĩ không
// nếu có hoặc không thì gửi mail về cái user đó để thông báo
// được tạo mới và cập nhật thay đổi
const doctorRequestSchema = new  mongoose.Schema({
  userId: {
   type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  speciality: {
    type: [String],
    enum: DOCTOR_HEHE,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  bio: String,
  degree: String,
  experience: String,
  about: String,
  
  fees: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  imgHanhNghe:{
   type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  province:{
    type:String
  },
  address:{
    type:String
  }
});

const doctorRequest = mongoose.model('doctorRequest', doctorRequestSchema);
export default doctorRequest;
