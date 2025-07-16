
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function AIDiagnose() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const { user } = useAuth();

  const handleDiagnose = async () => {
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả triệu chứng.");
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const res = await axiosInstance.post("/api/v1/ai/diagnose", { description });
      setResults(res.data);
    } catch (err) {
      toast.error("Không thể chẩn đoán AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">AI Chẩn đoán</h2>
      <textarea
        className="w-full border rounded-lg p-3 text-sm mb-4"
        rows={4}
        placeholder="Nhập mô tả triệu chứng của bạn..."
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
        onClick={handleDiagnose}
        disabled={loading}
      >
        {loading ? "Đang chẩn đoán..." : "Chẩn đoán AI"}
      </button>

      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          {results.map((item, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl shadow">
              <div>
                <b>Chẩn đoán:</b> {item.diagnosis}
              </div>
              <div>
                <b>Lý do:</b> {item.reason}
              </div>
              <div>
                <b>Chuyên khoa:</b> {item.specialty}
              </div>
              <div>
                <b>Bác sĩ đề xuất:</b>
                <ul className="list-disc ml-6">
                  {item.doctors && item.doctors.length > 0 ? (
                    item.doctors.map(doc => (
                      <li key={doc._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.avatarUrl}
                            alt={doc.userName || doc.name}
                            className="w-10 h-10 rounded-full border border-blue-200 shadow-sm object-cover"
                          />
                          <div>
                            <span className="font-semibold text-blue-700">{doc.userName || doc.name}</span>
                            <span className="ml-2 text-sm text-gray-500">({Array.isArray(doc.speciality) ? doc.speciality.join(", ") : doc.speciality})</span>
                            {doc.isVerified && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Đã xác thực</span>
                            )}
                          </div>
                        </div>
                        {user && (
                          <a
                            href={doc.appointmentLink.replace("USER_ID", user.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full font-semibold shadow hover:scale-105 transition"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Đặt lịch khám
                          </a>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">Không tìm thấy bác sĩ phù hợp.</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}