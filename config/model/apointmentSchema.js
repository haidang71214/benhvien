import mongoose, { mongo, Types } from 'mongoose';
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    doctorId:{type:Types.ObjectId,
      ref:'User',
      required:true
    },
    patientId:{
      type:Types.ObjectId,
      ref:'User',
      required:true
    },
    appointmentTime:Date,
})
const appointments = mongoose.model('appointments',appointmentSchema)
export default appointments
