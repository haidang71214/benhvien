import Notification from '../model/notification.js';
import appointments from '../model/apointmentSchema.js';
import { users } from '../model/user.js';
import nodeCron from 'node-cron';

// Send notification to user
export const sendNotification = async (userId, message, appointmentId = null, type = 'appointment') => {
  await Notification.create({ userId, message, appointmentId, type });
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Scheduled job: send reminders for upcoming appointments (e.g., 1 hour before)
nodeCron.schedule('* * * * *', async () => { // every 1 minute
  const now = new Date();
  const soon = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
  const appts = await appointments.find({
    appointmentTime: { $gte: now, $lt: soon }
  });
  for (const appt of appts) {
    // Prevent duplicate notifications for patient
    const patientNotiExists = await Notification.findOne({
      userId: appt.patientId,
      appointmentId: appt._id,
      type: 'reminder',
    });
    if (!patientNotiExists) {
      await sendNotification(
        appt.patientId,
        `You have an appointment with your doctor at ${new Date(appt.appointmentTime).toLocaleString()}.`,
        appt._id,
        'reminder'
      );
    }
    // Prevent duplicate notifications for doctor
    const doctorNotiExists = await Notification.findOne({
      userId: appt.doctorId,
      appointmentId: appt._id,
      type: 'reminder',
    });
    if (!doctorNotiExists) {
      await sendNotification(
        appt.doctorId,
        `You have an appointment with a patient at ${new Date(appt.appointmentTime).toLocaleString()}.`,
        appt._id,
        'reminder'
      );
    }
  }
});
