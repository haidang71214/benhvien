import mongoose from 'mongoose';

const testAssignmentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointments', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true }, // reference to Test
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  status: { type: String, enum: ['assigned', 'completed'], default: 'assigned' },
  result: { type: mongoose.Schema.Types.Mixed },
  orderCode: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TestAssignment = mongoose.model('TestAssignment', testAssignmentSchema);
export default TestAssignment;
