// làm cho doctor

import { appointments, doctorScheduals } from "../config/model/DE170023";

// lấy lịch khám chưa làm được
// xem lịch khám cá nhân làm tạm
const detailMySchedual = async(req,res) =>{
   try {
      const {id} = req.user;
      const data = await doctorScheduals.find({
         doctorId:id
      }).populate('')
      return res.status(200).json({data})
   } catch (error) {
      throw new Error(error);
   }
}
// lấy lịch khám của bác sĩ đó với bệnh nhân nào ? 
const getAppointment = async(req,res) =>{
   try {
      const {id} = req.user;
      const data = appointments.find({
         doctorId:id
      })
      return res.status(200).json({data})
   } catch (error) {
      throw new Error(error)
   }
}

// Hồ sơ bệnh án	Tạo & cập nhật chẩn đoán, đơn thuốc, cận lâm sàng
// Kê toa thuốc	Kê đơn, xem tồn kho cơ bản (để kê hợp lý)
// bác sĩ xin thiết bị, cập nhật tình hình thiết bị y tế 

export {detailMySchedual,getAppointment}