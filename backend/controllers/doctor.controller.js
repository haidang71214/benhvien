import mongoose from "mongoose";
import appointments from "../model/apointmentSchema.js";
import MedicalRecords from "../model/medical.js";
import medicines from "../model/medicines.js";
import { Prescription } from "../model/presctiption.js";
import { users } from "../model/user.js";
import { checkAdmin, checkDoctor } from "./admin.controller.js";

// tạo lịch khám, tạo đơn thuốc, kiểm tra thuốc trong kho
// tạo hồ sơ bệnh án, cập nhật hồ so bệnh án, xem hồ sơ bệnh án
// cập nhật cái trạng thái của thằng dụng cụ y tế, hỏng hay loại bỏ, hay đang vệ sinh
// xem tất cả lịch khám trong ngày. hôm nay khám cho ai ?
const getAppointment = async (req, res) => {
  try {
    const { id } = req.user;
    const data = appointments.find({
      doctorId: id,
    });
    return res.status(200).json({ data });
  } catch (error) {
    throw new Error(error);
  }
};
// tạo lịch khám cho tương lai, kiểu bệnh nhân đặt trước đồ á
// check điều kiện xem bệnh nhân có trong db chưa ? nếu mà có rồi thì lấy id nhét vô kiếm
// không có thì tạo bệnh nhân mới xong nhét id vô,
// chỗ này sẽ có 1 cái là tìm kiếm bệnh nhân hoặc các bác sĩ á
const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;            // ID người gọi API
    const userRole = req.user.role;        // Role người gọi
    const { id: paramPatientId } = req.params;          // Có thể undefined
    const { doctorId, appointmentTime } = req.body;     // Bắt buộc gửi

    if (!doctorId || !appointmentTime) {
      return res.status(400).json({ message: "Thiếu doctorId hoặc appointmentTime" });
    }

    // 🧩 Xác định patientId
    let patientId;
    if (userRole === "patient") {
      // Bệnh nhân chỉ được đặt cho mình
      if (paramPatientId && paramPatientId !== userId) {
        return res.status(403).json({ message: "Bạn không thể đặt lịch hộ người khác" });
      }
      patientId = userId;
    } else if (["doctor", "admin"].includes(userRole)) {
      // Bác sĩ/Admin phải truyền id bệnh nhân
      patientId = paramPatientId;
      if (!patientId) {
        return res.status(400).json({ message: "Thiếu patientId trên URL" });
      }
    } else {
      return res.status(403).json({ message: "Không có quyền đặt lịch" });
    }

    // 🔎 Kiểm tra tồn tại patient & doctor
    const [patient, doctor] = await Promise.all([
      users.findById(patientId),
      users.findById(doctorId),
    ]);
    if (!patient) return res.status(404).json({ message: "Bệnh nhân không tồn tại" });
    if (!doctor || doctor.role !== "doctor")
      return res.status(404).json({ message: "Bác sĩ không tồn tại" });

    // 🗓️ Kiểm tra thời gian (>=2 ngày, không quá khứ)
    const now = new Date();
    const apptDate = new Date(appointmentTime);
    if ((apptDate - now) / (1000 * 60 * 60 * 24) < 2) {
      return res.status(400).json({ message: "Phải đặt trước ít nhất 2 ngày" });
    }

    // ✅ Tạo lịch hẹn
    const appointment = await appointments.create({
      doctorId: new mongoose.Types.ObjectId(doctorId),
      patientId: new mongoose.Types.ObjectId(patientId),
      appointmentTime: apptDate,
    });

    return res.status(201).json({ data: appointment });
  } catch (err) {
    console.error("Lỗi tạo lịch:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// sửa cái lịch của thằng doctor
// lấy cái lịch cần sửa -> sửa xong thì thông báo cho thằng patients
// sửa lịch khám của chính thằng doctor với bệnh nhân đó, lấy id cái lịch khám đó nhét vô
const updateAppointment = async (req, res) => {
  try {
    // thay đổi cái lịch khám
    // lấy cái id của cái lịch đó
    // admin với thằng doctor được cập nhật
    const { id } = req.params;
    const userId = req.user.id;
    const { appointmentHehe, reason, doctorId: doctorIdFromBody } = req.body;
    //
    const isAdmin = await checkAdmin(userId);
    const isDoctor = await checkDoctor(userId);

    if (!isAdmin && !isDoctor) {
      return res.status(403).json({ message: "Không có quyền tạo lịch" });
    }
    const doctorId = isAdmin ? doctorIdFromBody : isDoctor ? userId : null;
    if (!doctorId) {
      return res.status(400).json({ message: "doctorId không hợp lệ" });
    }
    //
    const findAppointment = appointments.findById(id);
    if (!findAppointment) {
      return res.status(409).json({ message: "Hong tìm thấy cái lịch khám" });
    }
    const findUser = await users.findById(findAppointment.patientId);
    if (!findUser) {
      return res.status(409).json({ message: "Không tìm thấy user" });
    }
    const data = await appointments.findOneAndUpdate(
      {
        doctorId: mongoose.Types.ObjectId(userId),
        patientId: mongoose.Types.ObjectId(findUser._id), // quy chuẩn đầu vào ở chỗ này
      },
      {
        appointmentTime: appointmentHehe,
        reason,
      }
    );
    // làm cái gửi mail khi câph nhật
    const mailOption = {
      from: "dangpnhde170023@fpt.edu.vn",
      to: findUser.email,
      subject: `${reason}`,
      text: "best regart",
    };
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      }
    });
    return res.status(200).json({ data });
  } catch (error) {
    throw new Error(error);
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
const createPrescription = async (req, res) => {
  try {
    const userId = req.user.id;
    // lấy id của medicine, của từng cái loại thuốc ấy
    const { id } = req.params;
    // lấy id của medicine -> mấy viên 1 lần: dosage, frequently mấy lần 1 ngày, duy trì mấy ngày duration: -> tổng lượng thuốc cho mỗi cái đơn nhỏ
    const { dosage, frequently, duration } = req.body;

    if (!(await checkDoctor(userId))) {
      return res.status(409).json({ message: "Không có quyền tạo lịch " });
    }
    // check cái medicine check xem có còn không ? và trừ khi update xong
    const tongTungMedicineTrongDon = dosage * frequently * duration;
    const findQuantititesMedicine = await medicines.findById(id);
    if (tongTungMedicineTrongDon > findQuantititesMedicine.quantities) {
      return res
        .status(409)
        .json({ message: "Loại thuốc này không còn có đủ trong kho" });
    }
    const createPrescription = await Prescription.create({
      dosage,
      frequently,
      duration,
    });
    return res.status(200).json({ createPrescription });
  } catch (error) {
    throw new Error(error);
  }
};
// tạo hồ sơ mới, nhét cái mảng lưu những id của thằng prescription vô, với cái id của thằng apponitment ở trên vô đây
const createMedicalRecord = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      doctorId: doctorIdFromBody,
      symptoms,
      diagnosis,
      prescriptions,
      notes,
    } = req.body;
    const userId = req.user.id;
    const isAdmin = await checkAdmin(userId);
    const isDoctor = await checkDoctor(userId);

    if (!isAdmin && !isDoctor) {
      return res.status(403).json({ message: "Không có quyền tạo lịch" });
    }
    const doctorId = isAdmin ? doctorIdFromBody : isDoctor ? userId : null;
    if (!doctorId) {
      return res.status(400).json({ message: "doctorId không hợp lệ" });
    }
    const newMedicalRecord = await MedicalRecords.create({
      appointmentId,
      patientId,
      doctorId,
      symptoms,
      diagnosis,
      prescriptions,
      notes,
    });
    return res.status(200).json({ newMedicalRecord });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
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
};
