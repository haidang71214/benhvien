import { CalendarDays, Clock, Info, UserCheck } from "lucide-react";

const BookingScheduler = ({
  dateButtons = [],
  selectedDate,
  selectedTime,
  availableTimesByDate,
  bookedTimes = [],
  initialSymptom,
  setSelectedDate,
  setSelectedTime,
  setInitialSymptom,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="flex-1 space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-md space-y-6">
        <h3 className="text-xl font-bold text-pink-600 flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Chọn ngày khám
        </h3>
        <div className="flex flex-wrap gap-3">
          {dateButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedDate(btn.date);
                setSelectedTime("");
              }}
              className={`rounded-xl px-4 py-3 text-center text-sm font-medium border transition-all duration-300
              ${
                selectedDate &&
                btn.date.toDateString() === selectedDate.toDateString()
                  ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white scale-105 shadow-lg"
                  : "bg-white hover:bg-pink-50 text-gray-700 border-gray-200"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2 text-purple-600 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Chọn giờ khám
          </h4>
          <div className="flex flex-wrap gap-3">
            {selectedDate &&
              availableTimesByDate?.[
                selectedDate.toISOString().slice(0, 10)
              ]?.map((time) => {
                const isBooked = bookedTimes.includes(time);
                return (
                  <button
                    key={time}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    className={`px-5 py-2 text-sm rounded-full border transition-all
                    ${
                      isBooked
                        ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                        : selectedTime === time
                        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {time}
                    {isBooked && " (Đã đặt)"}
                  </button>
                );
              })}
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2 text-pink-600 flex items-center gap-2">
            <Info className="w-4 h-4" /> Triệu chứng ban đầu
          </h4>
          <textarea
            className="w-full border rounded-lg p-3 text-sm"
            rows={3}
            placeholder="Nhập triệu chứng ban đầu của bạn..."
            value={initialSymptom}
            onChange={(e) => setInitialSymptom(e.target.value)}
          />
        </div>
        <div className="text-right">
          <button
            onClick={onSubmit}
            disabled={!selectedDate || !selectedTime || isLoading}
            className={`px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300
              ${
                selectedDate && selectedTime && !isLoading
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:scale-105 shadow"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            <UserCheck className="inline w-4 h-4 mr-2" />
            {isLoading ? "Đang xử lý..." : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingScheduler;