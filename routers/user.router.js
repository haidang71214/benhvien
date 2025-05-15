import express from 'express';
import { middlewareTokenAsyncKey } from '../config/jwt.js';
import { createUser, deleteUser, detailSelf, getAlluser, getDetailUser, updateUser } from '../controllers/user.controller.js';
import { uploadCloud } from '../config/uploadCloud.js';


const userRouter = express.Router();
userRouter.post('/createUser',middlewareTokenAsyncKey,createUser);
userRouter.post('/updateUser/:id',middlewareTokenAsyncKey,uploadCloud.single('img'),updateUser);
userRouter.delete('/deleteUser/:id',middlewareTokenAsyncKey,deleteUser);
userRouter.get('/getAllUser',middlewareTokenAsyncKey,getAlluser)
// cần check admin
userRouter.get('/getDetailUser/:id',middlewareTokenAsyncKey,getDetailUser)
userRouter.get('/getDetailMySelf',middlewareTokenAsyncKey,detailSelf)
export default userRouter; 