import { get_diagnosis_from_gemini } from "../config/aisetup.js";
import { users } from "../model/user.js";

const GENAIHEHE = async (req, res) => {
  const { description } = req.body;
  console.log("🔍 Mô tả nhận được:", description);

  if (!description) {
    return res.status(400).json({ error: "Thiếu mô tả triệu chứng" });
  }

  try {
    const diagnoses = await get_diagnosis_from_gemini(description);
    if (!diagnoses || !Array.isArray(diagnoses)) {
      return res.status(500).json({ error: "Không xử lý được AI" });
    }

    const results = [];

    for (const diag of diagnoses) {
      if (!diag.enumspecialty) {
        console.warn("❗️AI không trả về enumspecialty hợp lệ:", diag);
        continue;
      }
      const doctors = await users
        .find({
          role: "doctor",
          speciality: diag.enumspecialty,
        })
        .select("-password -refreshToken -resetToken -resetTokenExpires");
      console.log("📌 Tìm với specialty:", diag.enumspecialty);
      results.push({
        reason: diag.reason,
        diagnosis: diag.diagnosis,
        specialty: diag.specialty,
        enumspecialty: diag.enumspecialty.trim(),
        doctors,
      });
    }

    console.log("🎯 Trả về kết quả:", results);
    if (results.length === 0) {
      console.warn(
        "⚠️ Không tìm thấy bác sĩ nào phù hợp với tất cả chẩn đoán."
      );
    }

    res.json(results);
  } catch (err) {
    console.error("🔥 Lỗi khi chẩn đoán:", err);
    res.status(500).json({ error: err.message || "Lỗi máy chủ" });
  }
};

export default GENAIHEHE;