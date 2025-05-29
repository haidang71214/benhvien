// làm cho doctor

import mongoose from "mongoose";
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
// tạo lịch khám cho tương lai, kiểu bệnh nhân đặt trước đồ á
// check điều kiện xem bệnh nhân có trong db chưa ? nếu mà có rồi thì lấy id nhét vô kiếm
// không có thì tạo bệnh nhân mới xong nhét id vô, 
// chỗ này sẽ có 1 cái là tìm kiếm bệnh nhân hoặc các bác sĩ á
const createAppointment = async(req,res) =>{
// tạo lịch khám ở tương lai
   try {
      const userId = req.user.id;
      const {id} = req.params
      const {appointmentTime} = req.body
   if(! await checkDoctor(userId)){
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
// sửa lịch khám của chính thằng doctor với bệnh nhân đó, lấy id cái lịch khám đó nhét vô
const updateAppointment = async(req,res) =>{
   try {
      // thay đổi cái lịch khám
      // lấy cái id của cái lịch đó
      // admin với thằng doctor được cập nhật
      const {id} = req.params;
      const userId = req.user.id
   const{appointmentHehe,reason} = req.body
   if(! await checkDoctor(userId) && ! await checkAdmin(userId) ){
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
      doctorId:mongoose.Types.ObjectId(userId) ,
      patientId:mongoose.Types.ObjectId(findUser._id) // quy chuẩn đầu vào ở chỗ này
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
// xóa lịch hẹn; thường là không xóa, xóa khi bệnh nhân yêu cầu, kông thì để đó làm record
const deleteAppointment = async(req,res) =>{
   try {
      const userId = req.user.id
      const {id} = req.params;
      const {reason} = req.body
   if(! await checkAdmin(userId) && ! await checkDoctor(userId)){
      return res.status(404).json({message:'Không có quyền cập nhật'})
   }
   const findAppointment = await appointments.findById(id);
   if(!findAppointment){
      return res.status(409).json({message:"Không tìm thấy cái appoinment"}) 
   }
   const response = await appointments.findByIdAndDelete(id)
   // có xóa những hồ sơ đi với lịch khám không ? 
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
// tạo cái hồ sơ theo lịch khám đã tạo sẵn
const createMedicaRedordByAppointment = async(req,res)=>{
   try {
      const{ symptoms, diagnosis, conclusion, notes,prescriptions} = req.body;
      // params lấy của cái appointment
      const {id} = req.params;
      const userId = req.user.id
      if (!await checkAdmin(userId) && !await checkDoctor(userId)) {
         return res.status(403).json({ message: "Bạn không có quyền tạo cái này" });
       }
      // lấy id của chính cái bệnh nhân trong cái lịch khám đó
      const getIdPatients  = await appointments.findById(id)
   
      // 2. Tạo đơn thuốc
     let prescriptionIds = [];
     if (Array.isArray(prescriptions) && prescriptions.length > 0) {
       const createdPrescriptions = await Promise.all(prescriptions.map(async (p) => {
         for (const item of p) {
           const med = await medicines.findById(item.medicineId);
           if (!med || med.quantities < item.dosage) {
             throw new Error(`Thuốc ${item.medicineId} không đủ tồn kho hoặc không tồn tại`);
           }
         }
         const prescription = new Prescription({
           medicineId: mongoose.Types.ObjectId(p.medicineId),
           dosage: p.dosage,
           frequently: p.frequently,
           duration: p.duration
         });
         return await prescription.save();
       }));
 
       prescriptionIds = createdPrescriptions.map(p => p._id);
     }
 
     // 3. Tạo hồ sơ bệnh án và gán prescriptions vào
     const medicalRecord = new MedicalRecords({
       appointmentId: mongoose.Types.ObjectId(id),
      //  bệnh nhân
       patientId: mongoose.Types.ObjectId(getIdPatients.patientId),
       // người tạo
       doctorId: mongoose.Types.ObjectId(userId),
       symptoms,
       diagnosis,
       conclusion: conclusion || '',
       notes: notes || '',
       prescriptions: prescriptionIds
     });
     await medicalRecord.save();
      
   } catch (error) {
      throw new Error(error);
      
   }
}

// Hồ sơ bệnh án	Tạo & cập nhật chẩn đoán, đơn thuốc, cận lâm sàng
// hồ sơ bệnh án lấy hồ sơ bệnh án của bệnh nhân đó, tạo mới hồ sơ bệnh án
// với mỗi hồ sơ bệnh án là đi với 1 bộ thuốc "Prescription" 
// lấy hết hồ sơ bệnh án của chính bệnh nhân đó
const getMedicalRecordPatients = async (req, res) => {
   try {
     const { id } = req.params;       // id bệnh nhân
     const userId = req.user.id;      // id người gọi API
     // Kiểm tra quyền
     if (!await checkAdmin(userId) && !await checkDoctor(userId)) {
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
      if (! await checkAdmin(userId) && !await checkDoctor(userId)) {
         return res.status(403).json({ message: "Bạn không có quyền xem hồ sơ này" });
    }
   const data = await MedicalRecords.find({doctorId:userId})
   return res.status(200).json({ data });
   } catch (error) {
      throw new Error(error)
   }
}
// tạo lịch khám ở thời gian hiện tại
const createAppointmentAndRecord = async (req, res) => {
   try {
     const userId = req.user.id;
     // tạo bệnh nhân trước -> lấy id của bệnh nhân đó theo params
      const patientId = req.params.id
     const { doctorId, reason, symptoms, diagnosis, conclusion, notes, prescriptions } = req.body;
 
     // Kiểm tra quyền: bác sĩ hoặc admin mới được tạo hồ sơ và lịch khám
     if (userId !== doctorId && !checkAdmin(userId) && !checkDoctor(userId)) {
       return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
     }

     // 1. Tạo lịch khám với thời gian hiện tại, ở đây
     // không cần điền cái reason, vì cái reason mình sẽ làm ở "tạo lịch khám tương lai"
     // cái tạo lịch khám ở hiện tại là để lấy record thôi, sau có thống kê các thứ thì mình dùng
     const newAppointment = new appointments({
       doctorId: mongoose.Types.ObjectId(doctorId),
       patientId: mongoose.Types.ObjectId(patientId),
       appointmentTime: new Date(),
       reason: reason || ''
     });
     await newAppointment.save();
 
     // 2. Tạo đơn thuốc (nếu có)
     let prescriptionIds = [];
     if (Array.isArray(prescriptions) && prescriptions.length > 0) {
       const createdPrescriptions = await Promise.all(prescriptions.map(async (p) => {
         for (const item of p) {
           const med = await medicines.findById(item.medicineId);
           if (!med || med.quantities < item.dosage) {
             throw new Error(`Thuốc ${item.medicineId} không đủ tồn kho hoặc không tồn tại`);
           }
         }
 
         const prescription = new Prescription({
           medicineId: mongoose.Types.ObjectId(p.medicineId),
           dosage: p.dosage,
           frequently: p.frequently,
           duration: p.duration
         });
         return await prescription.save();
       }));
 
       prescriptionIds = createdPrescriptions.map(p => p._id);
     }
 
     // 3. Tạo hồ sơ bệnh án và gán prescriptions vào
     const medicalRecord = new MedicalRecords({
       appointmentId: newAppointment._id,
       patientId: mongoose.Types.ObjectId(patientId),
       doctorId: mongoose.Types.ObjectId(doctorId),
       symptoms,
       diagnosis,
       conclusion: conclusion || '',
       notes: notes || '',
       prescriptions: prescriptionIds
     });
     await medicalRecord.save();
 
     res.status(201).json({
       message: "Tạo lịch khám, hồ sơ bệnh án và đơn thuốc thành công",
       appointment: newAppointment,
       medicalRecord,
       prescriptions: prescriptionIds
     });
   } catch (error) {
     console.error(error);
     return  res.status(500).json({ message: error.message || "Lỗi server" });
   }
 };
// update cái hồ sơ dựa trên lịch khám, thường là thay đổi thuốc, thay đổi hồ sơ
// search bệnh nhân 
const searchPatients = async(req,res) =>{
   try {
      const {q} = req.query;
      if(!q || q.trim() === ""){
         return res.status(400).json({message:"Nhập từ khóa tìm kiếm"})
      };
      const regex = new RegExp(q.trim(), "i");
     const patient = await users.find({
       role: "patient",
       $or: [{ userName: regex }, { email: regex }]
     });
 
     return res.status(200).json({ data: patient });
   } catch (error) {
      throw new Error(error);
   }
}

export {getAppointment,
   createAppointment,
   updateAppointment,
   deleteAppointment,
   getMedicalRecordPatients,
   doctorGetMedicalRecord,
   createAppointmentAndRecord,
   createMedicaRedordByAppointment,
   searchPatients
}