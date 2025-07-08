import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

// Chi tiết của từng đơn thuốc
const prescriptionSchema = new Schema({
  medicineId: {
    type: Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  dosage: {
    type: Number,
    required: true,
  },
  frequently: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export { Prescription };
