import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;


export const ROLE_ENUM = ['patient', 'admin', 'doctor', 'nurse', 'receptionist', 'accounting'];
export const STATUS_ENUM = ['NotUsed', 'InUse', 'UnderMaintenance', 'Broken', 'Removed'];
export const DOCTOR_HEHE = ['internal_medicine', 'pediatrics', 'dermatology', 'dentistry', 'ENT', 'ophthalmology', 'cardiology', 'neurology']
export const ROOM_ENUM = ['booked', 'checkedIn', 'inProgress', 'completed', 'cancelled']
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
  // những thuộc tính t bỏ dưới dòng này là những thuộc tính của doctor mới có
  specialty:{
    type:[String], // à, 1 bác sĩ có thể có nhiều chuyên ngành nên cái này mình để mảng thì hợp lí hơn
    enum:DOCTOR_HEHE
  },
  licenseNumber:{
    type:String // mã duy nhất của 1 bác sĩ được cấp phép
  },
  bio:{// mô tả
    type:String
  }
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
    
    cinicRoomId:{
      type:Types.ObjectId,
      ref:'cinicRoom',
      required:true
    },
    appointmentTime:Date,
    status:{
      type:String,
      enum:ROOM_ENUM,
      default:'booked'
    }
})
const clinicRoomSchema = new Schema({
  name:String, // phòng thì thường cố định nên thường không có tạo phòng
              // nhma giả định đi
  allowedSpecialized:{
    type:[String],
    enum:DOCTOR_HEHE
  },
  function:String // chức năng của 
})
const doctorSchedualSchema = new Schema({
  doctorId:{
    type:Types.ObjectId,
    ref:'User',
    required:false
  },
  dayOfWeek: {
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    required: true
  },  
  slot:{
    type:String,
    enum:['morning,afternoon'],
    required:true
  },
  //startTime thì dựa vào cái morning hay afternoon
  startTime:{
    type:Date,
    require:true
  }
})
// hồ sơ bệnh án
const medicalRecordSchema = new Schema({
  // lịch khám
  appointmentId: { 
    type: Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  patientId: {
    type: Types.ObjectId,
    ref: 'User', // user có role là patient
    required: true,
  },
  doctorId: {
    type: Types.ObjectId,
    ref: 'User', // user có role là doctor
    required: true,
  }, 
  // triệu chứng
  symptoms: {
    type: String,
    required: true,
  },
  // chuẩn đoán
  diagnosis: {
    type: String,
    required: true,
  },
  // kết luận
  conclusion: {
    type: String,
  },
  prescriptions: [{
    type: Types.ObjectId,
    ref: 'Prescription',
  }],
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  }
}, { timestamps: true });
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
// làm đơn thuốc? bệnh nhân có thể có nhiều đơn thuốc không?
const prescriptionSchema = new Schema({
  patientId:{
    type:Types.ObjectId,
    ref:'User'
  },
  doctorId:{
    type:Types.ObjectId,
    ref:'User'
  },
  dateIssuse:Date, // ngày tạo đơn thuốc
  note:String // chỉ định tái khám
})
// từng loại thuốc sẽ có những chỉ định uống khác nhau
const presctiptionDetailSchema = new Schema({
  medicineId:{
    type:Types.ObjectId,
    ref:'Medicine'
  },
  dosage:Number, // số lượng
  frequently:String, // mấy lần / ngày / tuần, nhắc uống thuốc
  duration:String // uống bao lâu ?
})



//
const presctiptionDetails = mongoose.model('presctiptionDetails',presctiptionDetailSchema)
const prescriptions = mongoose.model('prescriptions',prescriptionSchema)
const medicines = mongoose.model('medicines',medicineSchema)
const MedicalRecords = mongoose.model('MedicalRecords', medicalRecordSchema);
const doctorScheduals = mongoose.model('doctorScheduals',doctorSchedualSchema)
const clinicRooms = mongoose.model('clinicRooms',clinicRoomSchema)
const appointments = mongoose.model('appointments',appointmentSchema)
const payments = mongoose.model('payments',paymentSchema)
const equipmentDetails = mongoose.model('equipmentDetails',equipmentDetailSchema)
const equipments = mongoose.model('equipments',equipmentSchema)
const users = mongoose.model('users', userSchema);
export { users,equipments,equipmentDetails,payments,appointments,clinicRooms,doctorScheduals,MedicalRecords,medicines,prescriptions,presctiptionDetails };

// ADMIN
// Quyền truy cập: TẤT CẢ module – toàn quyền hệ thống
// Chức năng	Hành động được phép
// Quản lý người dùng	Thêm/sửa/xóa tất cả người dùng (bác sĩ, lễ tân, kế toán…)// oce
// Quản lý chuyên khoa	Quản lý danh sách chuyên khoa
// Quản lý bác sĩ	Gán chuyên khoa, cập nhật lịch làm việc 
// Lịch làm việc	Quản lý lịch toàn bộ bác sĩ
// Vật tư y tế	Theo dõi, cập nhật kho, tạo giao dịch nhập - xuất sẽ làm
// Hồ sơ bệnh án	Truy cập mọi hồ sơ
// Thanh toán	Xem/tổng hợp hóa đơn
// Báo cáo	Truy xuất toàn bộ thống kê
// Cấu hình hệ thống	Phân quyền, cấu hình nhắc lịch,

// DOCTOR (Bác sĩ)
// Quyền truy cập: Giới hạn trong khuôn khổ chuyên môn cá nhân

// Chức năng	Hành động được phép
// Lịch khám	Xem lịch cá nhân
// Bệnh nhân	Xem danh sách bệnh nhân đã đăng ký khám với mình
// Hồ sơ bệnh án	Tạo & cập nhật chẩn đoán, đơn thuốc, cận lâm sàng
// Kê toa thuốc	Kê đơn, xem tồn kho cơ bản (để kê hợp lý)
// Cận lâm sàng	Gửi yêu cầu, xem kết quả
// Phản hồi	Xem đánh giá bệnh nhân về mình nhớ làm bảng phản hồi

// RECEPTIONIST (Lễ tân)
// Quyền truy cập: Quản lý lịch hẹn và tiếp đón bệnh nhân

// Chức năng	Hành động được phép
// Bệnh nhân	Thêm bệnh nhân mới
// Lịch hẹn	Đặt lịch, xác nhận, hủy, chuyển lịch
// Danh sách khám	Kiểm tra lịch từng bác sĩ trong ngày
// Thanh toán	Hỗ trợ tạo hóa đơn
// Gửi nhắc lịch	SMS, Zalo, hoặc email

// ACCOUNTANT (Kế toán)
// Quyền truy cập: Tài chính – hóa đơn – thống kê

// Chức năng	Hành động được phép
// Hóa đơn	Tạo, cập nhật, xuất hóa đơn
// Thanh toán	Kiểm tra tình trạng thanh toán
// Báo cáo doanh thu	Thống kê theo ngày/tháng/bác sĩ

// NURSE (Điều dưỡng)
// Quyền truy cập: Hỗ trợ bác sĩ – xử lý cận lâm sàng – cấp phát thuốc

// Chức năng	Hành động được phép
// Xem lịch khám	Chuẩn bị trước ca khám
// Cận lâm sàng	Nhận chỉ định – nhập kết quả
// Kho thuốc	Cấp phát thuốc – trừ kho
// Giao tiếp bệnh nhân	Giải thích hướng dẫn dùng thuốc, theo dõi sau khám


// PATIENT (Bệnh nhân)
// Quyền truy cập: Tài khoản cá nhân, lịch sử khá
// Chức năng	Hành động được phép
// Đặt lịch khám	hiện tại mình block cái này, vì lịch khám bác sĩ có thể không chủ động được
// Xem lịch khám	
// Xem đơn thuốc	
// Xem kết quả xét nghiệm	File đính kèm -> pdf 
// Thanh toán	Trực tiếp hoặc quét mã
// Gửi phản hồi	Đánh giá bác sĩ, góp ý dịch vụ
// Nhận nhắc nhở	Lịch tái khám, thuốc