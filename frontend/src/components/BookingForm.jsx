import React from "react";
import {
  CalendarDays,
  Clock,
  UserCheck,
  Info,
  Stethoscope,
} from "lucide-react";
import { isValidDate, dateToLocalString } from "../utils/dateUtils";
import TimeSlot from "./TimeSlot";

const BookingForm = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  initialSymptom,
  setInitialSymptom,
  availableTimes,
  bookedTimes,
  onSubmit,
  isLoading,
}) => {
  const isBookingDisabled =
    !isValidDate(selectedDate) || !selectedTime || isLoading;

  return (
    <div className="flex-1 space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            Đặt lịch khám
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Vui lòng chọn ngày và giờ phù hợp
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Date Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <label className="text-lg font-semibold text-gray-800">
                  Chọn ngày khám
                </label>
                <p className="text-sm text-gray-500">
                  Chọn ngày bạn muốn đặt lịch
                </p>
              </div>
            </div>

            <div className="ml-13">
              <input
                type="date"
                className="w-full max-w-xs px-4 py-3 text-base font-medium border-2 border-gray-200 rounded-xl 
                         bg-white text-gray-700 transition-all duration-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         hover:border-gray-300 hover:shadow-sm"
                value={selectedDate ? dateToLocalString(selectedDate) : ""}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelectedDate(date);
                  setSelectedTime("");
                }}
                min={dateToLocalString(new Date())}
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Chọn giờ khám
                </h4>
                <p className="text-sm text-gray-500">
                  {isValidDate(selectedDate)
                    ? `${availableTimes.length} khung giờ có sẵn`
                    : "Vui lòng chọn ngày trước"}
                </p>
              </div>
            </div>

            <div className="ml-13">
              {isValidDate(selectedDate) ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableTimes.map((time) => (
                    <TimeSlot
                      key={time}
                      time={time}
                      isBooked={bookedTimes.includes(time)}
                      isSelected={selectedTime === time}
                      onSelect={setSelectedTime}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chọn ngày để xem khung giờ có sẵn</p>
                </div>
              )}
            </div>
          </div>

          {/* Symptom Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Triệu chứng ban đầu
                </h4>
                <p className="text-sm text-gray-500">
                  Mô tả ngắn gọn tình trạng sức khỏe
                </p>
              </div>
            </div>

            <div className="ml-13">
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-base 
                         transition-all duration-300 resize-none
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                         hover:border-gray-300"
                rows={4}
                placeholder="Ví dụ: Đau đầu, sốt nhẹ, ho khan... (Không bắt buộc)"
                value={initialSymptom}
                onChange={(e) => setInitialSymptom(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-2">
                Thông tin này sẽ giúp bác sĩ chuẩn bị tốt hơn cho buổi khám
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={onSubmit}
              disabled={isBookingDisabled}
              className={`w-full py-4 px-6 text-base font-semibold rounded-xl transition-all duration-300 
                        flex items-center justify-center gap-3 shadow-lg
                ${
                  !isBookingDisabled
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  <span>Đặt lịch khám</span>
                </>
              )}
            </button>

            {isBookingDisabled && !isLoading && (
              <p className="text-center text-sm text-gray-500 mt-3">
                {!isValidDate(selectedDate)
                  ? "Vui lòng chọn ngày khám"
                  : !selectedTime
                  ? "Vui lòng chọn giờ khám"
                  : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
