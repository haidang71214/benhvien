import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;

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
  // lấy tất cả đơn thuốc
  prescriptions: [{
    type: Types.ObjectId,
    ref: 'Prescription',
  }],
  notes: {
    type: String, // note mấy cái lịch hẹn tái chỉ định khám hay nhắc nhớ thân thiện
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  }
}, { timestamps: true });
const MedicalRecords = mongoose.model('MedicalRecords', medicalRecordSchema);

export default MedicalRecords