import express from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import medicineRouter from './medicine.route.js';
import doctorRouter from './doctor.route.js';


const rootRouter = express.Router();
rootRouter.use('/auth',authRouter);
// nói admin chứ kh phải lắm á, vì có những cái role khác cũng làm được, lấy tạm cái admin làm cái role nha =)) 

rootRouter.use('/admin',userRouter)
rootRouter.use('/medicine',medicineRouter);
rootRouter.use('/doctor',doctorRouter);

export default rootRouter; 