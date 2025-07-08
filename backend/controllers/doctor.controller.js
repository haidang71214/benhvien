import mongoose from "mongoose";
import appointments from "../model/apointmentSchema.js";
import MedicalRecords from "../model/medical.js";
import medicines from "../model/medicines.js";
import Prescription from "../model/prescription.js";
import { users } from "../model/user.js";
import { checkAdmin, checkDoctor, checkReceptionist } from "./admin.controller.js";

// tạo lịch khám, tạo đơn thuốc, kiểm tra thuốc trong kho
// tạo hồ sơ bệnh án, cập nhật hồ so bệnh án, xem hồ sơ bệnh án
// cập nhật cái trạng thái của thằng dụng cụ y tế, hỏng hay loại bỏ, hay đang vệ sinh
// xem tất cả lịch khám trong ngày. hôm nay khám cho ai ?
const getAppointment = async (req, res) => {
  try {
    const { id } = req.user.id;
    const data = appointments.find({
      doctorId: id,
    });
    return res.status(200).json({ data });
  } catch (error) {
    throw new Error(error);
  }
};

const getAppointmentsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await appointments.find({
      $or: [
        { patientId: userId },
        { doctorId: userId }
      ]
    })
    .populate("doctorId", "userName avatarUrl")
    .populate("patientId", "userName avatarUrl")
    ;
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    // Optional filters: doctorId, patientId, date
    const { doctorId, patientId, date } = req.query;
    const filter = {};

    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (date) {
      // date format: YYYY-MM-DD
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.appointmentTime = { $gte: start, $lt: end };
    }

    const data = await appointments
      .find(filter)
      .populate("doctorId", "userName avatarUrl")
      .populate("patientId", "userName avatarUrl");

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error in getAllAppointments:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const data = await appointments
      .findById(appointmentId)
      .populate("doctorId", "userName avatarUrl")
      .populate("patientId", "userName avatarUrl");
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// tạo lịch khám cho tương lai, kiểu bệnh nhân đặt trước đồ á
// check điều kiện xem bệnh nhân có trong db chưa ? nếu mà có rồi thì lấy id nhét vô kiếm
// không có thì tạo bệnh nhân mới xong nhét id vô,
// chỗ này sẽ có 1 cái là tìm kiếm bệnh nhân hoặc các bác sĩ á
const createAppointment = async (req, res) => {
  try {
    const { appointmentTime, doctorId, initialSymptom } = req.body;
    const patientId = req.user.id; // or from req.body if needed

    // 1. Check if booking date is in the past
    const appointmentDate = new Date(appointmentTime);
    const now = new Date();
    if (appointmentDate < now) {
      return res.status(400).json({ message: "Không thể đặt lịch cho ngày đã qua." });
    }

    // 2. Check for existing appointment with same doctor and time
    const exists = await appointments.findOne({
      doctorId,
      appointmentTime: appointmentDate
    });

    if (exists) {
      return res.status(400).json({ message: "Bác sĩ đã có lịch hẹn vào thời gian này. Vui lòng chọn thời gian khác." });
    }

    // If not exists and date is valid, create new appointment
    const newAppointment = await appointments.create({
      doctorId,
      patientId,
      appointmentTime: appointmentDate,
      reason: req.body.reason || "",
      initialSymptom
    });

    return res.status(201).json({ message: "Đặt lịch thành công", data: newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// sửa cái lịch của thằng doctor
// lấy cái lịch cần sửa -> sửa xong thì thông báo cho thằng patients
// sửa lịch khám của chính thằng doctor với bệnh nhân đó, lấy id cái lịch khám đó nhét vô
// const updateAppointment = async (req, res) => {
//   try {
//     // thay đổi cái lịch khám
//     // lấy cái id của cái lịch đó
//     // admin với thằng doctor được cập nhật
//     const { id } = req.params;
//     const userId = req.user.id;
//     const { appointmentHehe, reason, doctorId: doctorIdFromBody } = req.body;
//     //
//     const isAdmin = await checkAdmin(userId);
//     const isDoctor = await checkDoctor(userId);

//     if (!isAdmin && !isDoctor) {
//       return res.status(403).json({ message: "Không có quyền tạo lịch" });
//     }
//     const doctorId = isAdmin ? doctorIdFromBody : isDoctor ? userId : null;
//     if (!doctorId) {
//       return res.status(400).json({ message: "doctorId không hợp lệ" });
//     }
//     //
//     const findAppointment = appointments.findById(id);
//     if (!findAppointment) {
//       return res.status(409).json({ message: "Hong tìm thấy cái lịch khám" });
//     }
//     const findUser = await users.findById(findAppointment.patientId);
//     if (!findUser) {
//       return res.status(409).json({ message: "Không tìm thấy user" });
//     }
//     const data = await appointments.findOneAndUpdate(
//       {
//         doctorId: mongoose.Types.ObjectId(userId),
//         patientId: mongoose.Types.ObjectId(findUser._id), // quy chuẩn đầu vào ở chỗ này
//       },
//       {
//         appointmentTime: appointmentHehe,
//         reason,
//       }
//     );
//     // làm cái gửi mail khi câph nhật
//     const mailOption = {
//       from: "dangpnhde170023@fpt.edu.vn",
//       to: findUser.email,
//       subject: `${reason}`,
//       text: "best regart",
//     };
//     transporter.sendMail(mailOption, (err, info) => {
//       if (err) {
//         console.error("Error sending email:", err);
//       }
//     });
//     return res.status(200).json({ data });
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params; // appointment id
    const userId = req.user.id;
    const { newTime } = req.body; // newTime: ISO string or Date
    // Check role
    const isAdmin = await checkAdmin(userId);
    const isDoctor = await checkDoctor(userId);
    const isReceptionist = await checkReceptionist(userId);

    if (!isAdmin && !isDoctor && !isReceptionist) {
      return res.status(403).json({ message: "Không có quyền cập nhật lịch" });
    }

    // Find the appointment
    const appointment = await appointments.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    // Check if doctor is free at newTime
    const conflict = await appointments.findOne({
      doctorId: appointment.doctorId,
      appointmentTime: new Date(newTime),
      _id: { $ne: id }
    });
    if (conflict) {
      return res.status(400).json({ message: "Bác sĩ đã có lịch vào thời gian này." });
    }

    // Update appointment time
    appointment.appointmentTime = new Date(newTime);
    await appointment.save();

    return res.status(200).json({ message: "Đổi lịch thành công", data: appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
// xóa lịch hẹn; thường là không xóa, xóa khi bệnh nhân yêu cầu, kông thì để đó làm record
const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;
    if (!(await checkAdmin(userId)) && !(await checkDoctor(userId))) {
      return res.status(404).json({ message: "Không có quyền cập nhật" });
    }
    const findAppointment = await appointments.findById(id);
    if (!findAppointment) {
      return res.status(409).json({ message: "Không tìm thấy cái appoinment" });
    }
    const response = await appointments.findByIdAndDelete(id);
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
        console.error("Error sending email:", err);
      }
    });
    return res.status(200).json({ response });
  } catch (error) {
    throw new Error(error);
  }
};

// Hồ sơ bệnh án	Tạo & cập nhật chẩn đoán, đơn thuốc, cận lâm sàng
// hồ sơ bệnh án lấy hồ sơ bệnh án của bệnh nhân đó, tạo mới hồ sơ bệnh án
// với mỗi hồ sơ bệnh án là đi với 1 bộ thuốc "Prescription"
// lấy hết hồ sơ bệnh án của chính bệnh nhân đó
const getMedicalRecordPatients = async (req, res) => {
  try {
    const { id } = req.params; // id bệnh nhân
    const userId = req.user.id; // id người gọi API
    // Kiểm tra quyền
    if (!(await checkAdmin(userId)) && !(await checkDoctor(userId))) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem hồ sơ này" });
    }
    // Tìm tất cả hồ sơ bệnh án của bệnh nhân, populate đơn thuốc
    const data = await MedicalRecords.find({ patientId: id })
      .populate("prescriptions")
      .populate("doctorId", "userName email")
      .populate("appointmentId");

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ bệnh án cho bệnh nhân này" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
// doctor lấy hết hồ sơ bệnh án của bệnh nhân của mình, cái này để hỗ trợ cái trên làm cái list á, vì bệnh nhân nhiều lắm
const doctorGetMedicalRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { doctorId: doctorIdFromBody } = req.body;

    const isAdmin = await checkAdmin(userId);
    const isDoctor = await checkDoctor(userId);

    if (!isAdmin && !isDoctor) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem hồ sơ này" });
    }

    // Lấy doctorId tùy role
    const doctorId = isAdmin ? doctorIdFromBody : isDoctor ? userId : null;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId không hợp lệ" });
    }

    const data = await MedicalRecords.find({ doctorId: doctorId });

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// update cái hồ sơ dựa trên lịch khám, thường là thay đổi thuốc, thay đổi hồ sơ
// search bệnh nhân
const searchPatients = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Nhập từ khóa tìm kiếm" });
    }
    const regex = new RegExp(q.trim(), "i");
    const patient = await users.find({
      role: "patient",
      $or: [{ userName: regex }, { email: regex }],
    });

    return res.status(200).json({ data: patient });
  } catch (error) {
    throw new Error(error);
  }
};
// khi bệnh nhân tới khám thì làm gì ? thì tạo 1 cái appointment mới, với date là hiện tại -> lấy id của appointment đó, tạo thông tin của từng viên/ml thuốc gán thành mảng tạm -> xong bỏ vô hồ sơ
const createNowAppoinment = async (req, res) => {
  try {
    // chỉ có doctor mới tạo được cái này
    const userId = req.user.id;
    // lấy id của thằng user mới tạo
    const { id } = req.params;
    const checkUser = await users.findById(id);
    if (!(await checkDoctor(userId))) {
      return res.status(409).json({ message: "Không có quyền tạo lịch " });
    }
    if (!checkUser) {
      return res.status(409).json({ message: "User không tồn tại" });
    }
    const data = await appointments.create({
      doctorId: mongoose.Types.ObjectId(userId),
      patientId: mongoose.Types.ObjectId(id),
      appointmentTime: new Date(),
    });
    return res.status(200).json({ data });
  } catch (error) {
    throw new Error(error);
  }
}; // đây, khi tạo xong thì mình lấy cái id của cái đằng trên gán tạm vô cái biến tạm trong fe, tạo từng cái cách uống cho từng loại thuốc
// const createPrescription = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     // lấy id của medicine, của từng cái loại thuốc ấy
//     const { id } = req.params;
//     // lấy id của medicine -> mấy viên 1 lần: dosage, frequently mấy lần 1 ngày, duy trì mấy ngày duration: -> tổng lượng thuốc cho mỗi cái đơn nhỏ
//     const { dosage, frequently, duration } = req.body;

//     if (!(await checkDoctor(userId))) {
//       return res.status(409).json({ message: "Không có quyền tạo lịch " });
//     }
//     // check cái medicine check xem có còn không ? và trừ khi update xong
//     const tongTungMedicineTrongDon = dosage * frequently * duration;
//     const findQuantititesMedicine = await medicines.findById(id);
//     if (tongTungMedicineTrongDon > findQuantititesMedicine.quantities) {
//       return res
//         .status(409)
//         .json({ message: "Loại thuốc này không còn có đủ trong kho" });
//     }
//     const createPrescription = await Prescription.create({
//       dosage,
//       frequently,
//       duration,
//     });
//     return res.status(200).json({ createPrescription });
//   } catch (error) {
//     throw new Error(error);
//   }
// };
// tạo hồ sơ mới, nhét cái mảng lưu những id của thằng prescription vô, với cái id của thằng apponitment ở trên vô đây
// const createMedicalRecord = async (req, res) => {
//   try {
//     const {
//       appointmentId,
//       patientId,
//       doctorId: doctorIdFromBody,
//       symptoms,
//       diagnosis,
//       prescriptions,
//       notes,
//     } = req.body;
//     const userId = req.user.id;
//     const isAdmin = await checkAdmin(userId);
//     const isDoctor = await checkDoctor(userId);

//     if (!isAdmin && !isDoctor) {
//       return res.status(403).json({ message: "Không có quyền tạo lịch" });
//     }
//     const doctorId = isAdmin ? doctorIdFromBody : isDoctor ? userId : null;
//     if (!doctorId) {
//       return res.status(400).json({ message: "doctorId không hợp lệ" });
//     }
//     const newMedicalRecord = await MedicalRecords.create({
//       appointmentId,
//       patientId,
//       doctorId,
//       symptoms,
//       diagnosis,
//       prescriptions,
//       notes,
//     });
//     return res.status(200).json({ newMedicalRecord });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Lỗi server" });
//   }
// };

const createMedicalRecord = async (req, res) => {
  try {
    const { appointmentId, patientId, doctorId, symptoms, diagnosis, conclusion } = req.body;
    const newMedicalRecord = await MedicalRecords.create({
      appointmentId,
      patientId,
      doctorId,
      symptoms,
      diagnosis,
      conclusion,
      prescriptions: [],
    });
    res.status(200).json({ newMedicalRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPrescription = async (req, res) => {
  try {
    const { medicineId, medicalRecordId, dosage, frequently, duration } = req.body;

    // Fetch medicine details
    const medicine = await medicines.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Create prescription with medicines array
    const prescription = await Prescription.create({
      medicalRecordId,
      medicines: [
        {
          medicineId: medicine._id,
          name: medicine.name,
          dosage,
          frequency: frequently,
          duration,
          instructions: medicine.warning || "",
        },
      ],
    });
    res.status(200).json({ createPrescription: prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { symptoms, diagnosis, conclusion, prescriptions } = req.body;
    const updateData = {};
    if (symptoms !== undefined) updateData.symptoms = symptoms;
    if (diagnosis !== undefined) updateData.diagnosis = diagnosis;
    if (conclusion !== undefined) updateData.conclusion = conclusion;
    if (prescriptions !== undefined) updateData.prescriptions = prescriptions;

    const updated = await MedicalRecords.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicalRecordByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const record = await MedicalRecords.findOne({ appointmentId });
    if (!record) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionByMedicalRecord = async (req, res) => {
  try {
    const { medicalRecordId } = req.params;
    const prescription = await Prescription.findOne({ medicalRecordId });
    if (!prescription) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ data: prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { medicalRecordId, medicines } = req.body;

    const updated = await Prescription.findByIdAndUpdate(
      prescriptionId,
      { medicalRecordId, medicines },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Prescription not found" });
    res.status(200).json({ createPrescription: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAndFilterDoctor = async (req, res) => {
  try {
    const { specialty } = req.query;
    const query = { role: "doctor" };

    if (specialty) {
      const specialties = specialty.split(",").map((s) => s.trim());
      query.specialty = { $in: specialties };
    }

    const doctors = await users
      .find(query)
      .select("userName email specialty licenseNumber bio avatarUrl")
      .lean();

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No doctors found matching the criteria",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Error in getAndFilterDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  getAppointment,
  createAppointment, // tạo lịch khám ngẫu nhiên, t biết tạo như này thừa nhma t ngứa tay :v
  updateAppointment,
  deleteAppointment,
  getMedicalRecordPatients,
  doctorGetMedicalRecord,
  searchPatients,
  createNowAppoinment,
  createPrescription,
  createMedicalRecord,
  getAndFilterDoctor,
  getAppointmentsByUserId,
  getAllAppointments,
  getAppointmentById,
  updateMedicalRecord,
  getMedicalRecordByAppointment,
  getPrescriptionByMedicalRecord,
  updatePrescription,
};