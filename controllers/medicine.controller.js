
import medicines from "../config/model/medicines.js";
import { checkAdmin, checkDoctor, checkPatients } from "./admin.controller.js";

// xem thuốc tồn kho, thì cái role nào cũng xem được,trừ cái patients
// admin quản lí thuốc
const createMedicine = async(req,res) =>{
   const userId = req.user.id
   const {type,description,quantities,warning,name} = req.body
   try {
    const isAdmin = await checkAdmin(userId);
    const isDoctor = await checkDoctor(userId);
    if (!isAdmin && !isDoctor) {
      return res.status(403).json({ message: "Không có quyền" });
    }
    
// tạo thuốc mới, nếu thuốc đã có trong list của bệnh viện thì tiến hành update, cập nhật thêm
         if (!type || typeof type !== 'string' || type.trim() === '') {
            return res.status(400).json({ message: "type không được để trống" });
         }
         if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "name không được để trống" });
         }
         if (!description || typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ message: "description không được để trống" });
         }
         if (quantities === undefined || quantities === null || isNaN(quantities) || quantities < 0) {
            return res.status(400).json({ message: "quantities phải là số >= 0" });
         }
      // cấm chỉ định thì có thể có, có thể không, nếu mà trùng tên, trùng loại thì mặc định là có rồi
      // -> response = 0
      const existingMedicine = await medicines.findOne({ name: name.trim(), type: type.trim() });

      if (existingMedicine) {
        return res.status(409).json({ message: "Thuốc này đã tồn tại, vui lòng kiểm tra và update" });
      }
      const data = await medicines.create({
         name: name.trim(),
         type: type.trim(),
         description: description.trim(),
         quantities,
         warning: warning ? warning.trim() : ''
      })
      return res.status(200).json({message:data})
   } catch (error) {
      throw new Error(error)
   }
}
const getAllMedicine = async (req, res) => {
   const userId = req.user.id;
   try {
    const isPatient = await checkPatients(userId)
     if (isPatient) {
       return res.status(403).json({ message: 'Bệnh nhân không có quyền truy cập vào kho thuốc' });
     }
 
     const { page, limit, type } = req.query;
     const filter = {};
     if (type) filter.type = type;
     // Nếu có page & limit thì phân trang
     if (page && limit) {
       const pageNumber = parseInt(page);
       const limitNumber = parseInt(limit);
       const skip = (pageNumber - 1) * limitNumber;
 
       const data = await medicines.find(filter).skip(skip).limit(limitNumber);
       const total = await medicines.countDocuments(filter);
 
       return res.status(200).json({
         data,
         total,
         page: pageNumber,
         totalPages: Math.ceil(total / limitNumber),
       });
     } else {
       // Không phân trang thì lấy hết theo filter
       const data = await medicines.find(filter);
       return res.status(200).json({
         data,
         total: data.length,
       });
     }
   } catch (error) {
     return res.status(500).json({ message: error.message });
   }
 };
 
// search thuốc
//  /medicines/search?name=para
// /medicines/search?type=tablet
// Tìm theo cả tên và loạ
// /medicines/search?name=para&type=tablet
const searchMedicines = async (req, res) => {
   try {
     const { name, type } = req.query;
     const filter = {};
     if (name) {
       filter.name = { $regex: new RegExp(name, 'i') };
     }
     if (type) {
       filter.type = type;
     }
 
     const medicines = await medicines.find(filter); 
     return res.status(200).json({ data: medicines });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: 'Lỗi server' });
   }
 };
 // lấy id của cái medicine 
 const updateMedicine = async (req, res) => {
   try {
     const { id } = req.params;
     const { type, description, quantities, warning, name } = req.body;
     const userId = req.user.id;
 
     if (!await checkAdmin(userId)) {
       return res.status(403).json({ message: "Không phải admin thì không update được" });
     }
     
     // Tìm medicine theo id
     const medicine = await medicines.findById(id);
     if (!medicine) {
       return res.status(404).json({ message: "Không tìm thấy medicine" });
     }
 
     if (type !== undefined && type !== null) medicine.type = type;
     if (description !== undefined && description !== null) medicine.description = description;
     if (quantities !== undefined && quantities !== null) medicine.quantities = quantities;
     if (warning !== undefined && warning !== null) medicine.warning = warning;
     if (name !== undefined && name !== null) medicine.name = name;
 
     await medicine.save();
 
     res.status(200).json({ message: "Cập nhật thành công", medicine });
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };
// xóa thuốc, nào làm xong check kĩ
const deleteMedicine = async(req,res) =>{
  try {
   const userId = req.user.id;
   const {id} = req.params;
   if(!await checkAdmin(userId)){
      return res.status(404).json({message:"Không phải admin thì không xóa được"})
   }
   const findMedicine = await medicines.findById(id);
   if(!findMedicine){
      return res.status(400).json({
         message:"Hong tìm thấy thuốc cần xóa"
      })
   }
   await medicines.findByIdAndDelete(id);
   return res.status(200).json({message:"xóa thành công"})
  } catch (error) {
   throw new Error(error )
  } 
}

export {searchMedicines,getAllMedicine,createMedicine,updateMedicine,deleteMedicine}