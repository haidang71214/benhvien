// làm cho doctor

import appointments from "../config/model/apointmentSchema";
import MedicalRecords from "../config/model/medical";
import medicines from "../config/model/medicines";
import { Prescription } from "../config/model/presctiption";
import { users } from "../config/model/user";
import { checkAdmin, checkDoctor } from "./admin.controller";

// tạo lịch khám, tạo đơn thuốc, kiểm tra thuốc trong kho
// tạo hồ sơ bệnh án, cập nhật hồ so bệnh án, xem hồ sơ bệnh án
// cập nhật cái trạng thái của thằng dụng cụ y tế, hỏng hay loại bỏ, hay đang vệ sinh

// xem tất cả lịch khám trong ngày. hôm nay khám cho ai ?
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
// tí sửa cái trên

const createAppointment = async(req,res) =>{
   try {
      const userId = req.user.id;
      const {id} = req.params
      const {appointmentTime} = req.body
   if(!checkDoctor(userId)){
      return res.status(404).json({message:'Không phải bacs sĩ'})
   }
   else{
      const checkUser = await users.findOne(id);
      if(!checkUser){
         return res.status(409).json({message:'User không tồn tại'})
      }
      const data = await appointments.findOne({
         doctorId:userId,
         patientId:id,
         appointmentTime
      })
      return res.status(200).json({data})
   }
   } catch (error) {
      throw new Error(error)
   }
}
// sửa cái lịch của thằng doctor
// lấy cái lịch cần sửa -> sửa xong thì thông báo cho thằng patients
const updateAppointment = async(req,res) =>{
   try {
      // thay đổi cái lịch khám
      // lấy cái id của cái lịch đó
      // admin với thằng doctor được cập nhật
      const {id} = req.params;
      const userId = req.user.id
   const{appointmentHehe,reason} = req.body
   if(!checkDoctor(userId) || !checkAdmin(userId) ){
      return res.status(404).json({message :"Không phải bác si sĩ hoặc admin không cập nhật được"})
   };
   const findAppointment = appointments.findById(id);
   if(!findAppointment){
      return res.status(409).json({message:'Hong tìm thấy cái lịch khám'})
   }
   const findUser = await users.findById(findAppointment.patientId)
   if(!findUser){
      return res.status(409).json({message:'Không tìm thấy user'})
   }
   const data = await appointments.findOneAndUpdate({
      doctorId:userId,
      patientId:findUser._id // quy chuẩn đầu vào ở chỗ này
   },{
      appointmentTime: appointmentHehe,
      reason
   })
// làm cái gửi mail khi câph nhật
       const mailOption = {
         from: "dangpnhde170023@fpt.edu.vn",
         to: findUser.email,
         subject: `${reason}`,
         text: "best regart",
      };
       transporter.sendMail(mailOption, (err, info) => {
         if (err) {
           console.error('Error sending email:', err);
         }
       });
   return res.status(200).json({data}) 
   } catch (error) {
      throw new Error(error)
   }
}
// xóa lịch hẹn; nó sẽ tự động xóa với caias 
const deleteAppointment = async(req,res) =>{
// ? admin với thằng doctor được phép xóa
   try {
      const userId = req.user.id
      const {id} = req.params;
      const {reason} = req.body
   if(!checkAdmin(userId) || !checkDoctor(userId)){
      return res.status(404).json({message:'Không có quyền cập nhật'})
   }
   const findAppointment = await appointments.findById(id);
   if(!findAppointment){
      return res.status(409).json({message:"Không tìm thấy cái appoinment"}) 
   }
   const response = await appointments.findByIdAndDelete(id)
   // thông báo với cái người bác sĩ bị xóa
   const findUser = await users.findById(findAppointment.doctorId);
   const mailOption = {
      from: "dangpnhde170023@fpt.edu.vn",
      to: findUser.email,
      // lí do xóa ?
      subject: `${reason}`,
      text: "best regart",
   };
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      }
    });
   return res.status(200).json({response})
   } catch (error) {
      throw new Error(error )
   }
}
// tí check lại update xem có cần quy chẩn kh

// Hồ sơ bệnh án	Tạo & cập nhật chẩn đoán, đơn thuốc, cận lâm sàng
// hồ sơ bệnh án lấy hồ sơ bệnh án của bệnh nhân đó, tạo mới hồ sơ bệnh án
// với mỗi hồ sơ bệnh án là đi với 1 bộ thuốc "Prescription" 
// lấy hết hồ sơ bệnh án của chính bệnh nhân đó
const getMedicalRecordPatients = async (req, res) => {
   try {
     const { id } = req.params;       // id bệnh nhân
     const userId = req.user.id;      // id người gọi API
     // Kiểm tra quyền
     if (userId !== id && !checkAdmin(userId) && !checkDoctor(userId)) {
       return res.status(403).json({ message: "Bạn không có quyền xem hồ sơ này" });
     }
     // Tìm tất cả hồ sơ bệnh án của bệnh nhân, populate đơn thuốc
     const data = await MedicalRecords.find({ patientId: id })
       .populate('prescriptions') 
       .populate('doctorId', 'userName email')  
       .populate('appointmentId');
 
     if (!data || data.length === 0) {
       return res.status(404).json({ message: "Không tìm thấy hồ sơ bệnh án cho bệnh nhân này" });
     }
 
     return res.status(200).json({ data });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Lỗi server" });
   }
 };
// doctor lấy hết hồ sơ bệnh án của bệnh nhân của mình, cái này để hỗ trợ cái trên làm cái list á, vì bệnh nhân nhiều lắm
const doctorGetMedicalRecord = async(req,res) =>{
   try {
      const userId = req.user.id
      if (userId !== id && !checkAdmin(userId) && !checkDoctor(userId)) {
         return res.status(403).json({ message: "Bạn không có quyền xem hồ sơ này" });
    }
   const data = await MedicalRecords.find({doctorId:userId})
   return res.status(200).json({ data });
   } catch (error) {
      throw new Error(error)
   }
}
// tạo đơn cho từng cái thuốc trước, nó sẽ return ra cái id xong gán mảng vô cái hồ sơ nhé
const createPrescription = async (req, res) => {
   try {
     const userId = req.user.id;
     if (!checkAdmin(userId) || !checkDoctor(userId)) {
       return res.status(403).json({ message: "Bạn không có quyền tạo đơn thuốc" });
     }
     const { medicineId, dosage, frequently, duration } = req.body;
 
     const newPrescription = new Prescription({
       medicineId,
       dosage,
       frequently,
       duration,
     });
 
     const savedPrescription = await newPrescription.save();
 
     return res.status(201).json({ 
       message: 'Tạo đơn thuốc thành công', 
       prescriptionId: savedPrescription._id 
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: 'Lỗi máy chủ khi tạo đơn thuốc' });
   }
 };

// tạo mới hồ sơ bệnh án
const createMedicalRecord = async(req,res) => {
 try {
   const userId = req.user.id
   if (userId !== id && !checkAdmin(userId) && !checkDoctor(userId)) {
      return res.status(403).json({ message: "Bạn không có quyền tạo hồ sơ này" });
 }
 // tạo  đơn thuốc trước, xong tạo sau, xong gán cái id của đơn thuốc vô 

 } catch (error) {
   throw new Error(error)
 }  
}
export {getAppointment,createAppointment,updateAppointment,deleteAppointment,createMedicalRecord,getMedicalRecordPatients,doctorGetMedicalRecord}