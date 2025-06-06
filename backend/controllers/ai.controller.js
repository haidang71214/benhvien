import { get_diagnosis_from_gemini } from "../config/aisetup.js";
import { users } from "../config/model/user.js";

const GENAIHEHE = async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Thiếu mô tả triệu chứng" });

  try {
    const diagnoses = await get_diagnosis_from_gemini(description);
    if (!diagnoses || !Array.isArray(diagnoses)) {
      return res.status(500).json({ error: "Không xử lý được AI" });
    }

    const results = [];

    for (const diag of diagnoses) {
      const doctors = await users.find({
        role: "doctor",
        specialty: diag.enumspecialty, // DÙNG enumspecialty để so sánh với DB
      }).select("-password -refreshToken -resetToken -resetTokenExpires");

      results.push({
        reason: diag.reason,
        diagnosis: diag.diagnosis,
        specialty: diag.specialty,
        enumspecialty: diag.enumspecialty,
        doctors,
      });
    }

    res.json(results);
  } catch (err) {
    console.error("Lỗi khi chẩn đoán:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

export default GENAIHEHE;
