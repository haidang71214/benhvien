import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";

const MyAppointment = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${user.id}`)
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-xl shadow animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return (
    <div className="max-w-4xl mx-auto pt-24 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h2>
      <SkeletonLoader />
    </div>
  );

  if (!appointments.length) return (
    <div className="max-w-4xl mx-auto pt-24 px-4 text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h2>
      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-gray-600">No appointments found.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Appointments</h2>
      <ul className="space-y-6">
        {appointments.map((appt) => (
          <li
            key={appt._id}
            className="p-8 bg-white rounded-xl shadow-lg flex items-start gap-4 cursor-pointer hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
            onClick={() => (window.location.href = `/appointment-detail/${appt._id}`)}
          >
            {/* Doctor Avatar */}
            <div className="flex-shrink-0">
              {appt.doctorId?.avatarUrl ? (
                <img
                  src={appt.doctorId.avatarUrl}
                  alt={appt.doctorId.userName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {appt.doctorId?.userName?.[0] || "D"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div>
                <span className="font-semibold text-gray-700">Doctor:</span>{" "}
                <span className="text-gray-900">{appt.doctorId?.userName || "Unknown"}</span>
              </div>
              <div className="mt-1">
                <span className="font-semibold text-gray-700">Patient:</span>{" "}
                <span className="text-gray-900">{appt.patientId?.userName || "Unknown"}</span>
              </div>
              <div className="mt-1">
                <span className="font-semibold text-gray-700">Time:</span>{" "}
                <span className="text-gray-900">
                  {new Date(appt.appointmentTime).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <div className="mt-1">
                <span className="font-semibold text-gray-700">Initial Symptom:</span>{" "}
                <span className="text-gray-900">{appt.initialSymptom || "Not specified"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyAppointment;