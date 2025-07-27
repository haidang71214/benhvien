
import express from 'express';
import testAssignmentController from '../controllers/testAssignment.controller.js';
import multer from 'multer';

const router = express.Router();

import { uploadCloud } from '../config/uploadCloud.js';
// Nurse submits test result (support image upload to cloud)
router.put('/result/:testId', uploadCloud.single('image'), testAssignmentController.submitTestResult);

// Doctor assigns test to nurse (with price)
router.post('/assign', testAssignmentController.assignTest);

// Patient creates payment link for test assignment
router.post('/pay/:testId', testAssignmentController.createTestPaymentLink);


// Patient creates payment link for multiple test assignments
router.post('/pay-multi', testAssignmentController.createMultiTestPaymentLink);

// Handle test payment success (called by frontend after redirect)
router.get('/pay-success', testAssignmentController.handleTestPaymentSuccess);

// Nurse views assigned tests
router.get('/assigned/:nurseId', testAssignmentController.getAssignedTests);

// ...existing code...

// Get test results for an appointment
router.get('/results/:appointmentId', testAssignmentController.getTestResultsByAppointment);

export default router;
