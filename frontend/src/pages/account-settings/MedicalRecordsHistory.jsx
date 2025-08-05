import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FileText, CalendarDays, ChevronRight } from "lucide-react";

export default function MedicalRecordsHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "patient") {
      navigate("/");
      return;
    }
    fetchRecords();
    // eslint-disable-next-line
  }, [user]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/user/medical-records");
      setRecords(res.data.data || []);
    } catch (err) {
      setRecords([]);
      console.error("Failed to fetch medical records:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" />
          Medical Records
        </h2>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-lg">Loading...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg">No medical records found.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {records.map((rec) => (
              <div
                key={rec._id}
                onClick={() => navigate(`/appointment-detail/${rec.appointmentId?._id || rec.appointmentId}`)}
                className="flex items-center gap-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 rounded-xl px-5 py-4 shadow-sm cursor-pointer transition-all group"
              >
                <div className="flex-shrink-0">
                  {rec.doctorId?.avatarUrl ? (
                    <img
                      src={rec.doctorId.avatarUrl}
                      alt="Doctor"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border text-xl">
                      {rec.doctorId?.userName?.[0] || "?"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-gray-900 truncate">
                    {rec.doctorId?.userName || "Unknown Doctor"}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <CalendarDays className="w-4 h-4" />
                    {rec.createdAt
                      ? new Date(rec.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "No record date"}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
