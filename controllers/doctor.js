// làm cho doctor

import appointments from "../config/model/apointmentSchema";



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