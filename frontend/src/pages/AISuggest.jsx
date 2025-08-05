import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function AISuggest() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const { user } = useAuth();

  const handleSuggest = async () => {
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả triệu chứng.");
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const res = await axiosInstance.post("/ai/diagnose", { description });
      setResults(res.data);
    } catch (err) {
      toast.error("Không thể gợi ý AI.");
      console.error("Error fetching AI suggestions:", err);
    } finally {
      setLoading(false);
      setDescription("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Gợi ý Chẩn đoán
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mô tả triệu chứng của bạn và AI sẽ gợi ý chuyên khoa phù hợp cùng với các bác sĩ được đề xuất
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Mô tả triệu chứng của bạn
            </label>
            <div className="relative">
              <textarea
                className="w-full border-2 border-gray-200 rounded-2xl p-4 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none bg-gray-50 focus:bg-white"
                rows={6}
                placeholder="Ví dụ: Tôi bị đau đầu, chóng mặt, buồn nôn trong 3 ngày qua. Đau tăng vào buổi sáng và khi căng thẳng..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                {description.length}/500
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleSuggest}
              disabled={loading || !description.trim()}
            >
              <div className="flex items-center gap-3">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    <span>Phân tích với AI</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Kết quả phân tích</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {results.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Specialty Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Chuyên khoa được đề xuất</h3>
                      <p className="text-blue-100">{item.specialty}</p>
                    </div>
                  </div>
                </div>

                {/* Doctors List */}
                <div className="p-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Bác sĩ được đề xuất
                  </h4>
                  
                  {item.doctors && item.doctors.length > 0 ? (
                    <div className="space-y-4">
                      {item.doctors.map(doc => (
                        <div key={doc._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={doc.avatarUrl}
                                alt={doc.userName || doc.name}
                                className="w-16 h-16 rounded-2xl border-3 border-white shadow-lg object-cover"
                              />
                              {doc.isVerified && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="text-lg font-bold text-gray-800">
                                  {doc.userName || doc.name}
                                </h5>
                                {doc.isVerified && (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    Đã xác thực
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 font-medium">
                                {Array.isArray(doc.speciality) ? doc.speciality.join(", ") : doc.speciality}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">(4.8)</span>
                              </div>
                            </div>
                          </div>
                          
                          {user && (
                            <a
                              href={doc.appointmentLink.replace("USER_ID", user.id)}
                              className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Đặt lịch khám
                              </div>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">Không tìm thấy bác sĩ phù hợp</p>
                      <p className="text-gray-400">Vui lòng thử lại với mô tả khác</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Lưu ý quan trọng</h4>
              <p className="text-amber-700">
                Đây chỉ là gợi ý từ AI và không thể thay thế cho việc khám bệnh trực tiếp. 
                Vui lòng tham khảo ý kiến bác sĩ chuyên khoa để có chẩn đoán chính xác.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}