import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount((res.data.notifications || []).filter(n => !n.read).length);
    } catch (err) {
      console.log(err);
      
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    await axiosInstance.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  // Filter notifications to only those from today
  const today = new Date();
  const isToday = (dateString) => {
    const d = new Date(dateString);
    return d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
  };
  const todaysNotifications = notifications.filter(n => isToday(n.createdAt));

  return (
    <div className="relative">
      <button
        className="relative focus:outline-none"
        onClick={() => setShowDropdown((v) => !v)}
      >
        <span className="relative inline-block">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 bg-red-500 text-white text-base font-bold rounded-full text-center"
                  style={{transform: 'translate(65%,-65%)'}}>
              {unreadCount}
            </span>
          )}
        </span>
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 font-bold border-b">Notifications</div>
          {todaysNotifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications</div>
          ) : (
            todaysNotifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 border-b last:border-b-0 cursor-pointer ${n.read ? "bg-white" : "bg-blue-50"}`}
                onClick={() => {
                  markAsRead(n._id);
                  if (n.type === 'chat') {
                    navigate('/chat');
                  } else if (n.appointmentId) {
                    navigate(`/my-appointments`);
                  }
                }}
              >
                <div className="text-sm">
                  {n.type === 'chat' ? (
                    <span><span className="font-semibold text-blue-600">{n.message.replace('New message from ', '')}</span>: New message</span>
                  ) : n.message}
                </div>
                <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
          {/* View all notifications button */}
          <div className="p-2 border-t text-center bg-gray-50">
            <button
              className="text-blue-600 hover:underline text-sm font-medium"
              onClick={() => {
                setShowDropdown(false);
                navigate("/notifications");
              }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
