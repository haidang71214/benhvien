
import express from 'express';
import testAssignmentController from '../controllers/testAssignment.controller.js';

const testAssignmentRouter = express.Router();

import { uploadCloud } from '../config/uploadCloud.js';
// Nurse submits test result (support image upload to cloud)
testAssignmentRouter.put('/result/:testId', uploadCloud.single('image'), testAssignmentController.submitTestResult);

// Doctor assigns test to nurse (with price)
testAssignmentRouter.post('/assign', testAssignmentController.assignTest);

// Patient creates payment link for test assignment
testAssignmentRouter.post('/pay/:testId', testAssignmentController.createTestPaymentLink);


// Patient creates payment link for multiple test assignments
testAssignmentRouter.post('/pay-multi', testAssignmentController.createMultiTestPaymentLink);

// Handle test payment success (called by frontend after redirect)
testAssignmentRouter.get('/pay-success', testAssignmentController.handleTestPaymentSuccess);

// Nurse views assigned tests
testAssignmentRouter.get('/assigned/:nurseId', testAssignmentController.getAssignedTests);

// ...existing code...

// Get test results for an appointment
testAssignmentRouter.get('/results/:appointmentId', testAssignmentController.getTestResultsByAppointment);

export default testAssignmentRouter;
