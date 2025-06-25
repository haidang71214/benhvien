import PayOS from "@payos/node";
import payments from "../model/payment.js";
import { users } from "../model/user.js";
import TempBooking from "../model/TempBookingModel.js";
import appointments from "../model/apointmentSchema.js";

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export const createPaymentLink = async (req, res) => {
  try {
    const { amount, appointmentTime, doctorId, initialSymptom, patientId } = req.body;

    if (!amount || !appointmentTime || !doctorId || !patientId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const now = new Date();
    const apptTime = new Date(appointmentTime);
    if (apptTime < now) {
      return res.status(400).json({ message: "Can not booking appointment in the past" });
    }

    // Find user info
    const user = await users.findById(patientId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save temp booking info
    const tempBooking = await TempBooking.create({
      amount,
      appointmentTime,
      doctorId,
      initialSymptom,
      patientId,
    });

    // Use tempBooking._id as orderCode (must be number for PayOS)
    const orderCode = Number(String(tempBooking._id).replace(/\D/g, "").slice(-6) || Date.now().toString().slice(-6));

    const paymentBody = {
      orderCode,
      amount: Number(amount) * 1000,
      description: `Phí đặt lịch #${orderCode}`.slice(0, 25), // max 25 chars
      items: [
        {
          name: "Phí đặt lịch khám",
          quantity: 1,
          price: Number(amount) * 1000,
        },
      ],
      returnUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?orderCode=${orderCode}`,
      cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancel`,
      buyerName: user.userName || "Khách",
      buyerEmail: user.email || "noemail@example.com",
    };

    console.log("paymentBody", paymentBody);

    const paymentLink = await payos.createPaymentLink(paymentBody);

    // Save orderCode to tempBooking for lookup later
    tempBooking.orderCode = orderCode;
    await tempBooking.save();

    res.json({ url: paymentLink.checkoutUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  try {
    const { orderCode } = req.query;
    // Find temp booking by orderCode
    const tempBooking = await TempBooking.findOne({ orderCode });
    if (!tempBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Create the real appointment
    const appointment = await appointments.create({
      appointmentTime: tempBooking.appointmentTime,
      doctorId: tempBooking.doctorId,
      initialSymptom: tempBooking.initialSymptom,
      patientId: tempBooking.patientId,
      status: "booked",
    });

    // Store payment history
    await payments.create({
      tranSactionNo: orderCode,
      amount: tempBooking.amount,
      payMethod: "VNPay", // or get from payment gateway response if available
      payment_date: new Date(),
      patientId: tempBooking.patientId,
      // Add more fields if needed (e.g., appointmentId, response_code, etc.)
    });

    // Optionally, delete tempBooking
    await TempBooking.deleteOne({ _id: tempBooking._id });

    // Respond with appointmentId for frontend
    res.json({ appointmentId: appointment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};