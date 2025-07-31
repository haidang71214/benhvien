import transporter from "../config/email/transporter.js";
import doctorRequest from "../model/doctorRequestSchema.js";
import MedicalRecords from "../model/medical.js";
import { users } from "../model/user.js";
import { checkAdmin } from "./admin.controller.js";

 const getMyMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    // Only allow patients
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập." });
    }
    // Find all medical records for this patient
    const data = await MedicalRecords.find({ patientId: userId })
      .populate("prescriptions")
      .populate("doctorId", "userName email avatarUrl")
      .populate({ path: "appointmentId", select: "appointmentTime" });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server khi lấy hồ sơ bệnh án", error: err.message });
  }
};
// làm thêm cái duyệt form và accept
const acceptRejectFormToChangeRole = async(req,res) =>{
  try {
    const {formId} = req.params;
    console.log(formId);
    
    const {id} = req.user;
// ở đây, mình truyền tạm 1 cái status vào body, accept thì chuyển trạng thái và add data vào, còn reject thì cũng chuyển trạng thái của cái đơn đó
    const {status} = req.body
    const check = await checkAdmin(id);
    if(!check){
    return  res.status(404).json({message:"Chỉ có admin mới duyệt được"})
    }
    if(!formId){
    return  res.status(400).json({message:"Không tìm thấy form để chuyển"})
    }
    if(status == "accept"){
      const formAccept = await doctorRequest.findByIdAndUpdate(formId,{
        status:'approved'
      });
      const findUser = await users.findByIdAndUpdate(formAccept.userId,{
      speciality : formAccept.speciality,
      licenseNumber :formAccept.licenseNumber,
      bio : formAccept.bio,
      degree : formAccept.degree,
      experience : formAccept.experience,
      about: formAccept.about,
      fees :formAccept.fees,
      //  imgHanhNghe, ảnh hành nghề thì bỏ đi
      province : formAccept.province,
      address : formAccept.address,
      role:'doctor'
      });
     
    const mailOption = {
      from: process.env.MAIL_USER,
      to: findUser.email,
      subject: "Xét duyệt bác sĩ thành công",
    };
    await transporter.sendMail(mailOption);
  return  res.status(200).json({message:"Đã duyệt thay đổi sang role bác sĩ thành công",data:findUser})
    }else if(status == "rejected"){
        const formRejected = await doctorRequest.findByIdAndUpdate(formId,{
        status:'rejected'
      });
     const findUser = await users.findById(formRejected.userId)
    const mailOption = {
      from: process.env.MAIL_USER,
      to: findUser.email,
      subject: "Đã từ chối",
    };
    await transporter.sendMail(mailOption);
   return   res.status(200).json({message:"Đã từ chối đơn từ người dùng",data:formRejected})
    } 
    } catch (error) {
   throw new Error(error);
  }
}
const detailform = async(req,res) => {
  try {
    const {id} = req.params;
    const data  = await doctorRequest.findById(id).populate('userId' , 'userName');
   return res.status(200).json({message:data})
  } catch (error) {
    throw new Error(error);
  }
}
const getAllForm = async(req,res) =>{
  try {
    const data = await doctorRequest.find();
 return   res.status(200).json({data})
  } catch (error) {
    console.log(error);
    
    throw new Error(error);
    
  }
}
export{
  getAllForm,
  getMyMedicalRecords,
  detailform,
  acceptRejectFormToChangeRole
}