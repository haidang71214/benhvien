import express from 'express';
import { middlewareTokenAsyncKey } from '../config/jwt.js';
import { createMedicine, deleteMedicine, getAllMedicine, searchMedicines, updateMedicine } from '../controllers/medicine.controller.js';


const medicineRouter = express.Router();
medicineRouter.post('/create',middlewareTokenAsyncKey,createMedicine)
medicineRouter.get('/search',searchMedicines)
medicineRouter.get('/getAllAndFilter',middlewareTokenAsyncKey,getAllMedicine)
medicineRouter.put('/update/:id',middlewareTokenAsyncKey,updateMedicine)
medicineRouter.delete('/delete/:id',middlewareTokenAsyncKey,deleteMedicine)
// medicineRouter.post('/updateMyself',middlewareTokenAsyncKey,uploadCloud.single('img'),updateMyself); // update myself
export default medicineRouter; 