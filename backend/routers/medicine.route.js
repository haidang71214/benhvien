import express from 'express';
import { middlewareTokenAsyncKey } from '../config/jwt.js';
import { createMedicine, deleteMedicine, getAllMedicine, getDetailMedicine, searchMedicines, updateMedicine } from '../controllers/medicine.controller.js';


const medicineRouter = express.Router();
medicineRouter.post('/create',middlewareTokenAsyncKey,createMedicine)
medicineRouter.get('/search',searchMedicines)
medicineRouter.get('/getAllAndFilter',middlewareTokenAsyncKey,getAllMedicine)
// 
medicineRouter.put('/update/:id',middlewareTokenAsyncKey,updateMedicine)
// hiện tại không nên xóa thuốc, mà mình nên làm thay đổi trạng thái của những loại thuốc đó,
// hoặc t dang làm theo kiểu hạ cái số lượng của cái thuốc đó về 0 PUT
medicineRouter.put('/shutDownMedicine/:id',middlewareTokenAsyncKey,deleteMedicine)
// lấy chi tiết của cái thuốc
medicineRouter.get('/getDetailMedicine/:id',middlewareTokenAsyncKey,getDetailMedicine)
// medicineRouter.post('/updateMyself',middlewareTokenAsyncKey,uploadCloud.single('img'),updateMyself); // update myself
export default medicineRouter; 