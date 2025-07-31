import express from "express";
import { middlewareTokenAsyncKey } from "../config/jwt.js";
import {
  changeRoleUserToDoctor,
  createUser,
  deleteUser,
  detailSelf,
  getAllDoctors,
  getAlluser,
  getAllUsers,
  getDetailUser,
  searchDoctors,
  updateUser,
  banUser,
} from "../controllers/admin.controller.js";

import { getMyMedicalRecords } from "../controllers/user.controller.js";
import { uploadCloud } from "../config/uploadCloud.js";

const userRouter = express.Router();
// Patient: get their own medical records
userRouter.get(
  "/medical-records",
  middlewareTokenAsyncKey,
  getMyMedicalRecords
);
userRouter.post("/createUser", middlewareTokenAsyncKey, createUser); // create new user with admin rol
userRouter.post(
  "/updateUser/:id",
  middlewareTokenAsyncKey,
  uploadCloud.single("img"),
  updateUser
); // update user with admin role
userRouter.delete("/deleteUser/:id", middlewareTokenAsyncKey, deleteUser); // delete admin
userRouter.get("/getAllUser", getAlluser); // get all
// cần check admin  
userRouter.get("/getAllUsers", getAllUsers); // get all users
userRouter.get("/getAllDoctors", getAllDoctors);
userRouter.get("/getDetailUser/:id", middlewareTokenAsyncKey, getDetailUser); // get detail user by id
userRouter.get("/getDetailMySelf", middlewareTokenAsyncKey, detailSelf); // get my information
userRouter.get("/search", searchDoctors);
// chỗ này là thay đổi từ role nào đó sang role bác sĩ, đồng thời cập nhật mấy cái nó cần
userRouter.put(
  "/ChageRole/:id",
  middlewareTokenAsyncKey,
  changeRoleUserToDoctor
);
userRouter.post("/banUser/:id", middlewareTokenAsyncKey, banUser);
export default userRouter;
