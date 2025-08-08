import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";

export const useAppointments = (docId) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!docId) return;
    axiosInstance
      .get(`/doctor/getAppointmentsByUserId/${docId}`)
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]));
  }, [docId]);

  return appointments;
};
