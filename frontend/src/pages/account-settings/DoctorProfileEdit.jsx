import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { CalendarDays, CheckCircle, XCircle } from "lucide-react";

const weekdayLabels = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
  Sunday: "Chủ nhật",
};
const weekdays = Object.keys(weekdayLabels);
const defaultTimes = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function DoctorProfileEdit() {
  const [profile, setProfile] = useState(null);
  const [originalSchedule, setOriginalSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [manualTimes, setManualTimes] = useState(() =>
    Object.fromEntries(weekdays.map((day) => [day, ""]))
  );
  const [manualTimeErrors, setManualTimeErrors] = useState(() =>
    Object.fromEntries(weekdays.map((day) => [day, ""]))
  );

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/doctor-profile/profile")
      .then((res) => {
        setProfile(res.data);
        setOriginalSchedule(JSON.stringify(res.data.availableSchedule || {}));
      })
      .catch(() => setError("Không thể tải thông tin bác sĩ"))
      .finally(() => setLoading(false));
  }, []);

  const handleScheduleChange = (day, time) => {
    setProfile((prev) => {
      const schedule = { ...prev.availableSchedule };
      const times = new Set(schedule[day] || []);
      if (times.has(time)) times.delete(time);
      else times.add(time);
      schedule[day] = Array.from(times).sort();
      return { ...prev, availableSchedule: schedule };
    });
  };

  // Manual time input handler
  const handleManualTimeChange = (day, value) => {
    setManualTimes((prev) => ({ ...prev, [day]: value }));
    setManualTimeErrors((prev) => ({ ...prev, [day]: "" }));
  };

  // Validate HH:mm format and not duplicate
  const validateTime = (time) => {
    // Accepts 00:00 to 23:59
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  };

  const handleAddManualTime = (day) => {
    const time = manualTimes[day].trim();
    if (!validateTime(time)) {
      setManualTimeErrors((prev) => ({
        ...prev,
        [day]: "Định dạng giờ không hợp lệ (HH:mm)",
      }));
      return;
    }
    if (profile.availableSchedule?.[day]?.includes(time)) {
      setManualTimeErrors((prev) => ({
        ...prev,
        [day]: "Khung giờ đã tồn tại",
      }));
      return;
    }
    setProfile((prev) => {
      const schedule = { ...prev.availableSchedule };
      const times = new Set(schedule[day] || []);
      times.add(time);
      schedule[day] = Array.from(times).sort();
      return { ...prev, availableSchedule: schedule };
    });
    setManualTimes((prev) => ({ ...prev, [day]: "" }));
    setManualTimeErrors((prev) => ({ ...prev, [day]: "" }));
  };

  const handleSelectAll = (day) => {
    setProfile((prev) => {
      const schedule = { ...prev.availableSchedule };
      schedule[day] = [...defaultTimes];
      return { ...prev, availableSchedule: schedule };
    });
  };

  const handleClearAll = (day) => {
    setProfile((prev) => {
      const schedule = { ...prev.availableSchedule };
      schedule[day] = [];
      return { ...prev, availableSchedule: schedule };
    });
  };

  const isScheduleChanged = () => {
    if (!profile || !originalSchedule) return false;
    return JSON.stringify(profile.availableSchedule || {}) !== originalSchedule;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axiosInstance.put("/doctor-profile/profile", {
        availableSchedule: profile.availableSchedule,
      });
      toast.success("Cập nhật thành công!");
      setOriginalSchedule(JSON.stringify(profile.availableSchedule || {}));
    } catch (err) {
      setError("Cập nhật thất bại");
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <CalendarDays className="w-7 h-7 text-blue-500" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chỉnh sửa lịch làm việc
        </h2>
      </div>
      <p className="text-slate-600 mb-4 text-base">
        Chọn các khung giờ bạn có thể làm việc trong tuần. Nhấn{" "}
        <span className="font-semibold text-blue-600">"Chọn tất cả"</span> hoặc{" "}
        <span className="font-semibold text-blue-600">"Xóa tất cả"</span> để
        thao tác nhanh cho từng ngày.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {weekdays.map((day) => {
          const allSelected =
            profile.availableSchedule?.[day]?.length === defaultTimes.length;
          const noneSelected = !profile.availableSchedule?.[day]?.length;
          const customTimes = (profile.availableSchedule?.[day] || []).filter(
            (t) => !defaultTimes.includes(t)
          );
          return (
            <div
              key={day}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-100 p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-semibold text-blue-700 text-lg">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                  {weekdayLabels[day]}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                      allSelected
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                    }`}
                    onClick={() => handleSelectAll(day)}
                  >
                    <CheckCircle className="inline w-4 h-4 mr-2" />
                    Chọn tất cả
                  </button>
                  <button
                    type="button"
                    className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                      noneSelected
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-slate-400 text-black"
                    }`}
                    onClick={() => handleClearAll(day)}
                  >
                    <XCircle className="inline w-4 h-4 mr-2 text-black" />
                    Xóa tất cả
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {defaultTimes.map((time) => {
                  const selected =
                    profile.availableSchedule?.[day]?.includes(time);
                  return (
                    <label
                      key={time}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer border text-sm font-medium transition-all duration-100 shadow-sm ${
                        selected
                          ? "bg-blue-500 text-white border-blue-500 scale-105"
                          : "bg-white border-slate-200 hover:bg-blue-50"
                      }`}
                      style={{ minWidth: 70, justifyContent: "center" }}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleScheduleChange(day, time)}
                        className="accent-blue-600 hidden"
                      />
                      <span>{time}</span>
                    </label>
                  );
                })}
                {/* Custom times */}
                {customTimes.map((time) => (
                  <label
                    key={time}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer border text-sm font-medium transition-all duration-100 shadow-sm bg-green-500 text-white border-green-500 scale-105"
                    style={{ minWidth: 70, justifyContent: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleScheduleChange(day, time)}
                      className="accent-blue-600 hidden"
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
              {/* Manual time input */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="time"
                  value={manualTimes[day]}
                  onChange={(e) => handleManualTimeChange(day, e.target.value)}
                  className="border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  step="60"
                  placeholder="HH:mm"
                  style={{ width: 100 }}
                />
                <button
                  type="button"
                  className="text-xs px-3 py-1 rounded font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                  onClick={() => handleAddManualTime(day)}
                  disabled={!manualTimes[day]}
                >
                  Thêm giờ
                </button>
                {manualTimeErrors[day] && (
                  <span className="text-xs text-red-500 ml-2">
                    {manualTimeErrors[day]}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          disabled={saving || !isScheduleChanged()}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
