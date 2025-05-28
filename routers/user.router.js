import express from 'express';
import { middlewareTokenAsyncKey } from '../config/jwt.js';
import { createUser, deleteUser, detailSelf, getAlluser, getDetailUser, updateUser } from '../controllers/user.controller.js';
import { uploadCloud } from '../config/uploadCloud.js';


const userRouter = express.Router();
userRouter.post('/createUser',middlewareTokenAsyncKey,createUser); // create new user with admin rol
userRouter.post('/updateUser/:id',middlewareTokenAsyncKey,uploadCloud.single('img'),updateUser); // update user with admin role 
userRouter.delete('/deleteUser/:id',middlewareTokenAsyncKey,deleteUser);// delete admin
userRouter.get('/getAllUser',middlewareTokenAsyncKey,getAlluser) // get all
// cần check admin
userRouter.get('/getDetailUser/:id',middlewareTokenAsyncKey,getDetailUser) // get detail user by id
userRouter.get('/getDetailMySelf',middlewareTokenAsyncKey,detailSelf) // get my information
export default userRouter; 