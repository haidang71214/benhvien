
import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, CalendarCheck2, CheckCircle2 } from "lucide-react";

export default function AllNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      console.log(res);
      
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
      console.log('loz');
      
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await axiosInstance.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="w-7 h-7 text-blue-500" /> All Notifications
      </h2>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No notifications</div>
      ) : (
        <div className="divide-y">
          {notifications.map((n) => {
            let icon = <Bell className="w-6 h-6 text-gray-400" />;
            if (n.type === 'chat') icon = <MessageCircle className="w-6 h-6 text-blue-500" />;
            else if (n.type === 'appointment') icon = <CalendarCheck2 className="w-6 h-6 text-green-500" />;
            else if (n.read) icon = <CheckCircle2 className="w-6 h-6 text-gray-300" />;
            return (
              <div
                key={n._id}
                className={`flex items-start gap-3 p-4 transition-colors duration-150 cursor-pointer group ${n.read ? "bg-white" : "bg-blue-50 hover:bg-blue-100"}`}
                onClick={() => {
                  markAsRead(n._id);
                  if (n.type === 'chat') {
                    navigate('/chat');
                  } else if (n.appointmentId) {
                    navigate(`/my-appointments`);
                  }
                }}
              >
                <div className="pt-1">{icon}</div>
                <div className="flex-1">
                  <div className="text-base">
                    {n.type === 'chat' ? (
                      <span><span className="font-semibold text-blue-600">{n.message.replace('New message from ', '')}</span>: New message</span>
                    ) : n.message}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    {n.read ? <span className="inline-block w-2 h-2 rounded-full bg-gray-300" /> : <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                    {new Date(n.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                {!n.read && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white font-semibold">New</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
