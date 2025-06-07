import express from "express";
import {
  createAppointment,
  createMedicalRecord,
  createNowAppoinment,
  createPrescription,
  deleteAppointment,
  doctorGetMedicalRecord,
  getAndFilterDoctor,
  getMedicalRecordPatients,
  searchPatients,
  updateAppointment,
} from "../controllers/doctor.controller.js";
import { middlewareTokenAsyncKey } from "../config/jwt.js";

const doctorRouter = express.Router();
// ai search cũng được
doctorRouter.get("/searchPatients", searchPatients);
// tạo lịch khám cho tương lai -> truyền thằng userId vô đây
doctorRouter.post(
  "/createAppointmentFuture/:id",
  middlewareTokenAsyncKey,
  createAppointment
);
// cái getAppointment đó, nhớ sửa, t không biết là nên lấy lịch khám theo user hay theo ngày,
// sửa lịch khám, đồng thời gửi mail thông báo cho bệnh nhân -> lấy id là id của lịch khám
doctorRouter.put(
  "/updateAppointment/:id",
  middlewareTokenAsyncKey,
  updateAppointment
);
// xóa lịch hẹn, đồng thời gửi mail
doctorRouter.delete(
  "/deleteAppointment/:id",
  middlewareTokenAsyncKey,
  deleteAppointment
);
// truyền id của thằng user vô để lấy, quyền đang để là admin với doctor
doctorRouter.get(
  "/getPatientMedicalRecord/:id",
  middlewareTokenAsyncKey,
  getMedicalRecordPatients
);
// bác sĩ lấy hết hồ sơ bệnh nhân của chính mình
doctorRouter.get(
  "/doctorGetMedicalRecord",
  middlewareTokenAsyncKey,
  doctorGetMedicalRecord
);
// chỉ có role doctor mới vào được, cái này đang xét với trường hợp tới phòng khám thì mới tạo lịch khám ấy
// t nghĩ việc này là cần thiết, nếu mình có phát triển thêm thống kê thì việc tạo mới mỗi appoinment là khá cần thiết
// lấy id của thằng bệnh nhân
doctorRouter.post(
  "/createNowAppoinment/:id",
  middlewareTokenAsyncKey,
  createNowAppoinment
);
// tạo mới cho những cái thuốc, lấy id là id của từng loại thuốc, mỗi loại có kê đơn khác nhau, liều lượng khác nhau với tạo nhỏ như này
// dễ cho việc t viết code quản lí thuốc trong khi hơn, chỗ này khi hiểu thì gọi t
doctorRouter.post(
  "/createPresCription/:id",
  middlewareTokenAsyncKey,
  createPrescription
);
// tạo mới hồ sơ bệnh án -> sẽ lấy lịch hẹn và mảng id của thuốc nhét vào đây
doctorRouter.post(
  "/createmedicalrecord",
  middlewareTokenAsyncKey,
  createMedicalRecord
);
// admin tạo lịch khám cho thằng doctor, chỗ này bên fe check phải trước 2 ngày và không được dưới ngày hiện tại
doctorRouter.post("/createApoinment");
// filter doctor
doctorRouter.get("/filterDoctor", getAndFilterDoctor);
export default doctorRouter;