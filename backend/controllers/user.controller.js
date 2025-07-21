import MedicalRecords from "../model/medical.js";

export const getMyMedicalRecords = async (req, res) => {
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
