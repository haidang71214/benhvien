import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/stats', getDashboardStats);

export default dashboardRouter;
