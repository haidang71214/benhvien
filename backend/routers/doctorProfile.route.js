import { middlewareTokenAsyncKey } from "../config/jwt.js";
import express from "express";
import { getDoctorProfile, updateDoctorProfile } from "../controllers/user.controller.js";

const doctorProfileRouter = express.Router();

doctorProfileRouter.get("/profile", middlewareTokenAsyncKey, getDoctorProfile);
doctorProfileRouter.put("/profile", middlewareTokenAsyncKey, updateDoctorProfile);

export default doctorProfileRouter;
