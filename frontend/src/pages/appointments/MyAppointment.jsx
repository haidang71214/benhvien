import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";

import { Calendar as BigCalendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';


const locales = {
  'en-US': enUS,
};
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


  // Transform appointments to events for react-big-calendar
  const events = appointments.map(appt => ({
    id: appt._id,
    title: `${appt.doctorId?.userName || 'Unknown'}${appt.initialSymptom ? ' - ' + appt.initialSymptom : ''}`,
    start: new Date(appt.appointmentTime),
    end: new Date(new Date(appt.appointmentTime).getTime() + 30 * 60 * 1000), // 30 min slot
    resource: appt,
  }));

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Appointments</h2>
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <BigCalendar
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={['week', 'day']}
          step={30}
          timeslots={2}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 540 }}
          onSelectEvent={event => navigate(`/appointment-detail/${event.id}`)}
          popup
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              padding: '4px 8px',
              fontWeight: 500,
              boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)'
            }
          })}
          components={{
            event: ({ event }) => (
              <div className="truncate">
                <span className="font-semibold">{event.title}</span>
              </div>
            )
          }}
        />
      </div>
    </div>
  );
};

export default MyAppointment;