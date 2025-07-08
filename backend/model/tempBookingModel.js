import mongoose from "mongoose";
const { Schema } = mongoose;

const tempBookingSchema = new Schema({
  amount: Number,
  appointmentTime: Date,
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
  initialSymptom: String,
  patientId: { type: Schema.Types.ObjectId, ref: "User" },
  orderCode: Number,
});

export default mongoose.model("TempBooking", tempBookingSchema);