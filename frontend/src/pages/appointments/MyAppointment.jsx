import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  Calendar as BigCalendar,
  Views,
  dateFnsLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const MyAppointment = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current User:", user); // 👈 kiểm tra full object

    if (!user || !user.id) {
      console.warn("No user ID found, skipping fetch");
      return;
    }
    console.log("Fetching appointments for user ID:", user.id); // 👉 Thêm dòng này
    setLoading(true);

    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${user.id}`)
      .then((res) => {
        console.log("Appointments fetched:", res.data.data);
        setAppointments(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching appointments", err);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white rounded-xl shadow flex gap-4 items-center"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Lịch hẹn của tôi
            </h2>
            <p className="text-sm text-gray-500">
              Xem tổng quan các cuộc hẹn sắp tới của bạn
            </p>
          </div>
        </div>
        <SkeletonLoader />
      </div>
    );

  if (!appointments.length)
    return (
      <div className="max-w-4xl mx-auto pt-24 px-4 text-center">
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Lịch hẹn của tôi
            </h2>
            <p className="text-sm text-gray-500">Bạn chưa có lịch hẹn nào</p>
          </div>
        </div>
        <div className="p-8 bg-white rounded-xl shadow flex flex-col items-center space-y-4">
          <Calendar className="w-12 h-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-700">
            Chưa có lịch hẹn nào
          </p>
          <p className="text-sm text-gray-500">Hãy đặt lịch hẹn để bắt đầu!</p>
        </div>
      </div>
    );

  console.log("Appointments data:", appointments);

  const events = appointments.map((appt) => ({
    id: appt._id,
    title: `${appt.doctorId?.userName || "Không rõ"}${
      appt.initialSymptom ? " - " + appt.initialSymptom : ""
    }`,
    start: new Date(appt.appointmentTime),
    end: new Date(new Date(appt.appointmentTime).getTime() + 30 * 60 * 1000),
    resource: appt,
  }));

  console.log("Events to show:", events);

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Lịch hẹn của tôi</h2>
          <p className="text-sm text-gray-500">
            Xem và quản lý các lịch hẹn đã đặt
          </p>
        </div>
      </div>
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <BigCalendar
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={["week", "day"]}
          step={30}
          timeslots={2}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 540 }}
          onSelectEvent={(event) => navigate(`/appointment-detail/${event.id}`)}
          popup
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#1d4ed8",
              color: "white",
              borderRadius: "0.5rem",
              padding: "6px 10px",
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
              cursor: "pointer",
            },
          })}
          components={{
            event: ({ event }) => (
              <div className="truncate">
                <span className="font-semibold">{event.title}</span>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default MyAppointment;
