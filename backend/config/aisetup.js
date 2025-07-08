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
- Gợi ý chuyên khoa phù hợp để bệnh nhân khám (trường "specialty").
- Chỉ trả lời **duy nhất** bằng chuỗi JSON hợp lệ theo cấu trúc sau, không thêm chữ nào khác:
- trả lại đúng cái ở mục tên chuyên khoa bằng tiếng việt, 1 mục là enum chuyên khoa bằng tiếng anh (key), được lấy ở đây {
  internal_medicine: "Nội khoa",
  pediatrics: "Nhi khoa",
  dermatology: "Da liễu",
  dentistry: "Nha khoa",
  ENT: "Tai Mũi Họng",
  ophthalmology: "Nhãn khoa",
  cardiology: "Tim mạch",
  neurology: "Thần kinh",
};
[
  {
    "reason": "giải thích chính xác", 
    "diagnosis": "tên bệnh",
    "specialty": "tên chuyên khoa",
    "enumspecialty":"tên chuyên khoa bằng tiếng anh"
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonStr = text.match(/\[.*\]/s)?.[0]; // bắt khối JSON
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Lỗi khi gọi Gemini:", err);
    return [];
  }
}
