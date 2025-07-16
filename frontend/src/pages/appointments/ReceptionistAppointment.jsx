import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";

const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/doctor/getAllAppointments")
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="pt-32 text-center text-gray-500 text-lg">
        Loading appointments...
      </div>
    );
  if (!appointments.length)
    return (
      <div className="pt-32 text-center text-gray-500 text-lg">
        No appointments found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pt-24">
      <h2 className="text-2xl font-bold mb-8 text-blue-700">
        All Appointments
      </h2>
      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li
            key={appt._id}
            className="p-4 bg-white rounded-2xl shadow flex flex-col sm:flex-row items-center gap-6 border border-blue-100"
          >
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <div>
                  <span className="font-semibold">Patient:</span>{" "}
                  {appt.patientId?.userName || appt.patientId}
                </div>
                <div>
                  <span className="font-semibold">Doctor:</span>{" "}
                  {appt.doctorId?.userName || appt.doctorId}
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Time:</span>{" "}
                {new Date(appt.appointmentTime).toLocaleString()}
              </div>
              <div className="mt-1 text-sm">
                {/* <span className="font-semibold">Status:</span>{" "} */}
                <span
                  className={
                    appt.status === "pending"
                      ? "text-yellow-600"
                      : appt.status === "confirmed"
                      ? "text-green-600"
                      : appt.status === "completed"
                      ? "text-blue-600"
                      : appt.status === "cancelled"
                      ? "text-red-600"
                      : "text-gray-700"
                  }
                >
                  {appt.status}
                </span>
              </div>
            </div>
            <button
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition-all"
              onClick={() => navigate(`/reschedule-appointment/${appt._id}`)}
            >
              Reschedule
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceptionistAppointments;