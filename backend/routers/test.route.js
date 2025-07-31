import express from 'express';
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
} from '../controllers/test.controller.js';

const testRoutes = express.Router();
// sửa cái này r
testRoutes.post('/create', createTest);
testRoutes.get('/getAll', getAllTests);
testRoutes.get('/:id', getTestById);
testRoutes.put('/:id', updateTest);
testRoutes.delete('/:id', deleteTest);

export default testRoutes;
