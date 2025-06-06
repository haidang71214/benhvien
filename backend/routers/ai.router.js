import express from 'express';
import GENAIHEHE from '../controllers/ai.controller.js';
const aiRouter = express.Router()
// nhập cái mô tả triệu chứng vào
aiRouter.post('/diagnose',GENAIHEHE)
export default aiRouter