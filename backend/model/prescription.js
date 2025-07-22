import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

const instructionSchema = new Schema({
  mealTime: String,
  mealRelation: String,
  custom: String,
}, { _id: false });

const medicineItemSchema = new Schema({
  medicineId: {
    type: Types.ObjectId,
    ref: 'medicines',
    required: true,
  },
  name: String,
  dosage: String, // liều lượng
  duration: String,
  instructions: [instructionSchema], // now an array of instruction objects
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