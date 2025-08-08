import { useMemo } from "react";
import { isValidDate, dateToLocalString } from "../utils/dateUtils";

export const useSchedule = (selectedDate, appointments, docInfo, docId) => {
  return useMemo(() => {
    if (!isValidDate(selectedDate) || !docInfo?.availableSchedule) {
      return { availableTimes: [], bookedTimes: [] };
    }

    const selectedDateStr = dateToLocalString(selectedDate);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const bookedTimes = appointments
      .filter(
        (appt) =>
          (appt.doctorId?._id === docId || appt.doctorId === docId) &&
          dateToLocalString(new Date(appt.appointmentTime)) === selectedDateStr
      )
      .map((appt) =>
        new Date(appt.appointmentTime)
          .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          .slice(0, 5)
      );

    return {
      availableTimes: docInfo.availableSchedule[dayName] || [],
      bookedTimes,
    };
  }, [selectedDate, appointments, docInfo, docId]);
};
