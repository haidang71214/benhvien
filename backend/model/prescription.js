import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

const medicineItemSchema = new Schema({
  medicineId: {
    type: Types.ObjectId,
    ref: 'medicines',
    required: true,
  },
  name: String,
  dosage: String, // liều lượng
  frequency: String,
  duration: String, 
  instructions: String
}, { _id: false });

const prescriptionSchema = new Schema({
  medicalRecordId: {
    type: Types.ObjectId,
    ref: 'MedicalRecords',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  medicines: [medicineItemSchema]
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;