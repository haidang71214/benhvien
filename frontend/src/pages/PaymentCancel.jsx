import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Thanh toán đã bị huỷ.");
    const timer = setTimeout(() => {
      navigate("/doctors");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-yellow-600">
        Thanh toán đã bị huỷ. Bạn có thể thử lại hoặc kiểm tra lịch hẹn của mình.
      </div>
    </div>
  );
}