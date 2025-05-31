import mongoose, { mongo, Types } from 'mongoose';
import { STATUS_ENUM } from './user';
const { Schema } = mongoose;

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
    default: 'InUse', // mặc định là dùng đến
    required: true
  }
  // muốn chuyển thành đang dùng thì cần có điều kiện gì ? xin từ kho, bác sĩ xin, admin duyệt
})
const equipmentDetails = mongoose.model('equipmentDetails',equipmentDetailSchema)
const equipments = mongoose.model('equipments',equipmentSchema)
export {equipments,equipmentDetails}