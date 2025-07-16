import express from 'express';
import { createPaymentLink, handlePaymentSuccess, getAllPayments } from '../controllers/payment.controller.js';
import { middlewareTokenAsyncKey } from '../config/jwt.js';

const paymentRoute = express.Router();

paymentRoute.post('/create-payment-link', middlewareTokenAsyncKey, createPaymentLink);
paymentRoute.get('/payment-success', handlePaymentSuccess);

// Get all payments
paymentRoute.get('/getAll', getAllPayments);

export default paymentRoute;