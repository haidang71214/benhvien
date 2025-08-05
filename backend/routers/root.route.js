import doctorRouter from './doctor.route.js';
import express from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';


import medicineRouter from './medicine.route.js';


import dashboardRouter from './dashboard.route.js';
import notificationRouter from './notification.route.js';
import chatRouter from './chat.route.js';
import testAssignmentRouter from './testAssignment.route.js';
import testRoutes from './test.route.js';
import aiRoutes from './ai.route.js';
import paymentRoute from './payment.route.js';


const rootRouter = express.Router();
rootRouter.use('/auth',authRouter);
// nói admin chứ kh phải lắm á, vì có những cái role khác cũng làm được, lấy tạm cái admin làm cái role nha =)) 
rootRouter.use('/test-assignment',testAssignmentRouter)
rootRouter.use('/test',testRoutes)
rootRouter.use('/admin',userRouter)
rootRouter.use('/chat',chatRouter)
rootRouter.use('/dashboard', dashboardRouter);
rootRouter.use('/medicine',medicineRouter);
rootRouter.use('/doctor',doctorRouter);

rootRouter.use('/notifications',notificationRouter);
rootRouter.use('/ai',aiRoutes);
rootRouter.use('/payment',paymentRoute);
export default rootRouter; 