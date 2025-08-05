import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function get_diagnosis_from_gemini(description) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Bạn là một bác sĩ AI có kiến thức y học chính xác.

Dưới đây là mô tả triệu chứng của bệnh nhân:
"""${description}"""

Yêu cầu:
- Phân tích và đưa ra 1 hoặc 2 bệnh có khả năng cao nhất.
- Giải thích lý do vì sao có chẩn đoán đó (trong trường "reason").
- Gợi ý chuyên khoa phù hợp để bệnh nhân khám.

- Trả về DUY NHẤT chuỗi JSON hợp lệ theo cấu trúc sau (KHÔNG bao \`\`\`json, không mô tả gì thêm):
[
  {
    "reason": "giải thích",
    "diagnosis": "tên bệnh",
    "specialty": "Tên chuyên khoa tiếng Việt",
    "enumspecialty": "Tên chuyên khoa tiếng Anh đúng theo danh sách này"
  }
]

Chỉ được sử dụng enumspecialty sau:

{
  "General physician": "Bác sĩ đa khoa",
  "Gynecologist": "Phụ khoa",
  "Dermatologist": "Da liễu",
  "Pediatricians": "Nhi khoa",
  "Neurologist": "Thần kinh",
  "Gastroenterologist": "Tiêu hóa"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const jsonStr = text.match(/\[.*\]/s)?.[0];
    if (!jsonStr) {
      console.error("❌ Không tìm thấy JSON trong kết quả:", text);
      return [];
    }
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (err) {
    console.error("🔥 Lỗi khi gọi Gemini:", err);
    return [];
  }
}