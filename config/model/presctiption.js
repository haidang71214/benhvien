import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;


// làm đơn thuốc? bệnh nhân có thể có nhiều đơn thuốc không?
const presctiptionDetailSchema = new Schema({
  medicineId:{
    type:Types.ObjectId,
    ref:'Medicine'
  },
  dosage:Number, // số lượng
  frequently:String, // mấy lần / ngày / tuần, nhắc uống thuốc
  duration:String // uống bao lâu ?
})
// làm đơn thuốc? bệnh nhân có thể có nhiều đơn thuốc không?
const prescriptionSchema = new Schema({
  patientId:{
    type:Types.ObjectId,
    ref:'User'
  },
  doctorId:{
    type:Types.ObjectId,
    ref:'User'
  },
  dateIssuse:Date, // ngày tạo đơn thuốc
  note:String // chỉ định tái khám
})
// từng loại thuốc sẽ có những chỉ định uống khác nhau


const presctiptionDetails = mongoose.model('presctiptionDetails',presctiptionDetailSchema)
const prescriptions = mongoose.model('prescriptions',prescriptionSchema)
export  {presctiptionDetails,prescriptions}