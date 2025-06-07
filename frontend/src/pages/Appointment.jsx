<<<<<<< HEAD
import React from 'react'

const Appointment = () => {
  return (
    <div>Appointment</div>
  )
}

export default Appointment
=======
import { useState, useEffect } from "react";
import { assets, doctors } from "../assets/data/doctors";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

const AppointmentBooking = () => {
  const { docId } = useParams();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(-1);
  const [slotTime, setSlotTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const daysOfWeeks = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchDocInfo = () => {
      const info = doctors.find((item) => item._id === docId);
      setDocInfo(info);
      setDocSlots(info?.slots || []);
    };
    fetchDocInfo();
  }, [docId]);

  const handleBookAppointment = async () => {
    if (!slotTime || slotIndex === -1) return;

    const slotDetails = docSlots[slotIndex]?.find(
      (slot) => slot.time === slotTime
    );
    if (!slotDetails || !docInfo) return;

    setIsBooking(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/booking/create`,
        {
          doctorId: docInfo._id,
          slotId: slotDetails._id,
        },
        { withCredentials: true }
      );

      toast.success("📅 Booking successful!");
      setSlotIndex(-1);
      setSlotTime("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Booking failed.");
    } finally {
      setIsBooking(false);
    }
  };

  if (!docInfo) {
    return (
      <div className="text-center py-20 text-gray-600 text-xl">
        Loading doctor info...
      </div>
    );
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
        <div className="bg-gradient-to-r h-32"></div>
        <div className="relative px-6 md:px-10 pb-10 -mt-20">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="w-40 h-40 rounded-2xl border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {docInfo.name}
                <img
                  src={assets.verified_icon}
                  alt="Verified"
                  className="w-6 h-6"
                />
              </h2>
              <p className="text-gray-600 mt-1 mb-2">
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {docInfo.experience} years experience
              </span>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold mb-1">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {docInfo.languages.map((lang, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Available Days</h4>
                  <div className="flex flex-wrap gap-2">
                    {docInfo.availableDays.map((day, i) => (
                      <span
                        key={i}
                        className="bg-green-100 px-2 py-1 rounded-full text-green-800"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-700">🗓️ Choose Date</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {docSlots.map((item, index) => {
            const date = new Date(item[0]?.dateTime);
            return (
              <div
                key={index}
                onClick={() => setSlotIndex(index === slotIndex ? -1 : index)}
                className={`min-w-[80px] text-center p-3 rounded-xl cursor-pointer transition transform hover:scale-105 ${
                  index === slotIndex
                    ? "text-white shadow-md"
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <p className="text-sm font-medium">
                  {daysOfWeeks[date.getDay()].slice(0, 3)}
                </p>
                <p className="text-xl font-bold">{date.getDate()}</p>
              </div>
            );
          })}
        </div>

        {slotIndex !== -1 && (
          <>
            <h3 className="text-xl font-bold mt-8 mb-4 text-gray-700">
              ⏰ Choose Time
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {docSlots[slotIndex]?.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSlotTime(item.time)}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    slotTime === item.time
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md scale-105"
                      : "bg-white border border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {item.time}
                </button>
              ))}
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={!slotTime || isBooking}
              className={`mt-6 w-full sm:w-auto px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                slotTime && !isBooking
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isBooking ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Booking...
                </div>
              ) : (
                <>📋 Book Appointment</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
>>>>>>> fe-demo
