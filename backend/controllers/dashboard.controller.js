import { users } from '../model/user.js';
import medicines from '../model/medicines.js';
import payments from '../model/payment.js';
import appointments from '../model/apointmentSchema.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Count doctors
    const doctorCount = await users.countDocuments({ role: 'doctor' });
    // Count patients
    const patientCount = await users.countDocuments({ role: 'patient' });
    // Count medicines
    const medicineCount = await medicines.countDocuments();
    // Count invoices (payments)
    const invoiceCount = await payments.countDocuments();
    // Revenue (sum of all payments)
    const revenue = await payments.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    // Appointments count (this month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const appointmentCount = await appointments.countDocuments({
      appointmentTime: { $gte: firstDay, $lte: now }
    });
    res.json({
      doctorCount,
      patientCount,
      medicineCount,
      invoiceCount,
      revenue: revenue[0]?.total || 0,
      appointmentCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
