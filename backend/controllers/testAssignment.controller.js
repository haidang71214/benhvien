

import TestAssignment from '../model/testAssignment.js';
import Notification from '../model/notification.js';
import Test from '../model/test.js';

const testAssignmentController = {};

// Patient creates payment link for multiple test assignments
testAssignmentController.createMultiTestPaymentLink = async (req, res) => {
  try {
    const { testIds } = req.body;
    if (!Array.isArray(testIds) || testIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No test IDs provided' });
    }
    // Fetch all test assignments and populate patientId and testId
    const tests = await TestAssignment.find({ _id: { $in: testIds } }).populate('patientId testId');
    if (tests.length === 0) {
      return res.status(404).json({ success: false, message: 'No test assignments found' });
    }
    // Only unpaid tests
    const unpaidTests = tests.filter(test => test.paymentStatus !== 'paid');
    if (unpaidTests.length === 0) {
      return res.status(400).json({ success: false, message: 'All tests are already paid' });
    }
    // Assume all tests are for the same patient
    const patient = unpaidTests[0].patientId;
    // Calculate total amount
    const totalAmount = unpaidTests.reduce((sum, test) => sum + (Number(test.testId.price) || 0), 0);
    // Generate orderCode from first test assignment (last 6 digits of numeric part)
    const orderCode = Number(String(unpaidTests[0]._id).replace(/\D/g, '').slice(-6) || Date.now().toString().slice(-6));
    // Prepare items array for PayOS
    const items = unpaidTests.map(test => ({
      name: test.testId.name,
      quantity: 1,
      price: Number(test.testId.price),
    }));
    // Use PayOS to create payment link
    const PayOS = (await import("@payos/node")).default;
    const payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY
    );
    const paymentBody = {
      orderCode,
      amount: totalAmount,
      description: `Phí xét nghiệm tổng hợp #${orderCode}`.slice(0, 25),
      items,
      returnUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?orderCode=${orderCode}&type=test`,
      cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancel`,
      buyerName: patient.userName || "Khách",
      buyerEmail: patient.email || "noemail@example.com",
    };
    const paymentLink = await payos.createPaymentLink(paymentBody);
    // Optionally, store orderCode in all test assignments
    await Promise.all(unpaidTests.map(test => {
      test.orderCode = orderCode;
      return test.save();
    }));
    res.json({ url: paymentLink.checkoutUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Doctor assigns test to nurse
testAssignmentController.assignTest = async (req, res) => {
  try {
    const { appointmentId, patientId, doctorId, nurseId, testId } = req.body;
    if (!testId) {
      return res.status(400).json({ success: false, message: "Test ID is required" });
    }
    const testDef = await Test.findById(testId);
    if (!testDef) {
      return res.status(404).json({ success: false, message: "Test type not found" });
    }
    const test = await TestAssignment.create({
      appointmentId,
      patientId,
      doctorId,
      nurseId,
      testId,
      paymentStatus: 'unpaid',
    });

    // Create notification for nurse
    await Notification.create({
      userId: nurseId,
      type: 'test_assignment',
      message: `You have been assigned a new test: ${testDef.name}`,
      appointmentId,
    });

    res.status(201).json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Patient pays for a test assignment
testAssignmentController.createTestPaymentLink = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await TestAssignment.findById(testId).populate('patientId testId');
    if (!test) return res.status(404).json({ success: false, message: "Test assignment not found" });
    if (test.paymentStatus === 'paid') return res.status(400).json({ success: false, message: "Test already paid" });

    // Use PayOS to create payment link
    const PayOS = (await import("@payos/node")).default;
    const payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY
    );
    const orderCode = Number(String(test._id).replace(/\D/g, "").slice(-6) || Date.now().toString().slice(-6));
    const paymentBody = {
      orderCode,
      amount: Number(test.testId.price) * 1000,
      description: `Phí xét nghiệm #${orderCode}`.slice(0, 25),
      items: [
        {
          name: `${test.testId.name}`,
          quantity: 1,
          price: Number(test.testId.price) * 1000,
        },
      ],
      returnUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?testId=${test._id}&type=test`,
      cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancel`,
      buyerName: test.patientId.userName || "Khách",
      buyerEmail: test.patientId.email || "noemail@example.com",
    };
    const paymentLink = await payos.createPaymentLink(paymentBody);
    // Optionally, store orderCode in test assignment
    test.orderCode = orderCode;
    await test.save();
    res.json({ url: paymentLink.checkoutUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark test assignment as paid (called after payment success)
testAssignmentController.handleTestPaymentSuccess = async (req, res) => {
  try {
    const { testId, orderCode } = req.query;
    if (orderCode) {
      // Multi-test payment: mark all with this orderCode as paid
      const tests = await TestAssignment.find({ orderCode }).populate('testId');
      if (!tests || tests.length === 0) {
        return res.status(404).json({ success: false, message: "Test assignment not found" });
      }
      await Promise.all(tests.map(test => {
        test.paymentStatus = 'paid';
        return test.save();
      }));
      // Compose summary for frontend
      const totalAmount = tests.reduce((sum, test) => sum + (Number(test.testId?.price) || 0), 0);
      const testNames = tests.map(test => test.testId?.name || '').join(', ');
      const paymentDate = new Date();
      // Store payment record
      const paymentsModel = (await import('../model/payment.js')).default;
      await paymentsModel.create({
        tranSactionNo: orderCode,
        amount: totalAmount,
        payMethod: 'PayOS',
        payment_date: paymentDate,
        patientId: tests[0].patientId,
        // Optionally, add more info (testIds, testNames, etc)
      });
      // Get the payment record just created
      const paymentRecord = await paymentsModel.findOne({ tranSactionNo: orderCode });
      res.json({
        success: true,
        order: {
          orderCode,
          amount: totalAmount,
          testNames,
          payment_date: paymentDate,
          tests: tests.map(test => ({ _id: test._id, name: test.testId?.name, price: test.testId?.price })),
          payment: paymentRecord,
        },
        data: tests
      });
    } else if (testId) {
      // Single test payment
      const test = await TestAssignment.findById(testId);
      if (!test) return res.status(404).json({ success: false, message: "Test assignment not found" });
      test.paymentStatus = 'paid';
      await test.save();
      res.json({ success: true, data: test });
    } else {
      res.status(400).json({ success: false, message: "Missing testId or orderCode" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Nurse views assigned tests
testAssignmentController.getAssignedTests = async (req, res) => {
  try {
    const nurseId = req.params.nurseId;
    const tests = await TestAssignment.find({ nurseId, status: 'assigned' })
      .populate({ path: 'patientId', select: 'userName email avatarUrl' })
      .populate({ path: 'doctorId', select: 'userName email avatarUrl' })
      .populate('appointmentId')
      .populate('testId');
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Nurse submits test result
// Nurse submits test result (supports image upload)
testAssignmentController.submitTestResult = async (req, res) => {
  try {
    const { testId } = req.params;
    let result = {};
    // If images uploaded, add imageUrls array to result
    if (req.files && req.files.length > 0) {
      result.imageUrls = req.files.map(f => f.path || f.secure_url || f.url);
    } else if (req.file && req.file.path) {
      // fallback for single file (should not happen with .array, but for safety)
      result.imageUrl = req.file.path || req.file.secure_url || req.file.url;
    }
    // Merge other fields from body (notes, etc)
    if (req.body.notes) result.notes = req.body.notes;
    // For blood/urine/other tests, flatten nested 'result' if present
    if (req.body.result && typeof req.body.result === 'object') {
      Object.assign(result, req.body.result);
    }
    // For other test types, merge all fields from body except 'notes' and 'result'
    Object.keys(req.body).forEach(key => {
      if (key !== 'notes' && key !== 'result') result[key] = req.body[key];
    });
    const test = await TestAssignment.findByIdAndUpdate(
      testId,
      { result, status: 'completed', updatedAt: Date.now() },
      { new: true }
    );
    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get test results for an appointment
testAssignmentController.getTestResultsByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    // Return all tests for this appointment (assigned and completed)
    const tests = await TestAssignment.find({ appointmentId })
      .populate('testId')
      .populate({ path: 'nurseId', select: 'userName email avatarUrl' });
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default testAssignmentController;
