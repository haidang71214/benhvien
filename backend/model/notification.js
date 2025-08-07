import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  type: { type: String, enum: ['appointment', 'reminder', 'system', 'chat', 'test_assignment'], default: 'appointment' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointments' },
});

export default mongoose.model('Notification', notificationSchema);
