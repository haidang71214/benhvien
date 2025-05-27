import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;


export const ROLE_ENUM = ['patient', 'admin', 'doctor', 'nurse', 'receptionist', 'accounting'];
export const STATUS_ENUM = ['NotUsed', 'InUse', 'UnderMaintenance', 'Broken', 'Removed'];


const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, 'Name cannot be null'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  age: {
    type: Number,
    default: null,
  },
  role: {
    type: String,
    enum: ROLE_ENUM, // bỏ role user đi
    default: 'patient',
  },
  refreshToken: {
    type: String,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  faceAppId: {
    type: String,
    default: null,
  },
}, { timestamps: true });
// quản lí thiết bị phòng khám mỗi thiết bị phòng khám thì sẽ có
//  nhiều cái size tương ứng với những chức năng đó, số lượng,status: tình trạng thiết bị, dụng cụ phòng khám
const equipmentSchema = new Schema({
  brand:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  img:{
    type:String,
    required:false
  }
})
// chỗ này mình sẽ khai báo số lượng,
//  đi kèm với size và chức năng của chính cái dụng cụ đó
// quan hệ 1 nhiều nhen
const equipmentDetailSchema = new Schema({
  equipment_id: {
    type: Types.ObjectId,
    ref: 'Equipment', // model
    required: true,
  },
  size: {
    type: String,
  // với những thứ như ống tiêm đồ thì ấy lên, còn bai tay với mấy cái dụng cụ thì cứ s m l xl
    enum: ['S', 'M', 'L', 'XL', '18G', '20G', '22G', '25G', '27G', '30G'],
    required: true
  },
  // function mình có thể để array cho dễ truy xuất
  function:{
    type:String
  },
  status: {
    type: String,
    enum: STATUS_ENUM,
    default: 'NotUsed', // mặc định là chưa dùng đến
    required: true
  }
  // muốn chuyển thành đang dùng thì cần có điều kiện gì ? xin từ kho, bác sĩ xin, admin duyệt
})



const equipmentDetails = mongoose.model('equipmentDetails',equipmentDetailSchema)
const equipments = mongoose.model('equipments',equipmentSchema)
const users = mongoose.model('users', userSchema);
export { users,equipments,equipmentDetails };