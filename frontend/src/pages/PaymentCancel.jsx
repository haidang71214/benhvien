import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { XCircle, ArrowLeft, Home, Calendar, Clock } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [isTestPayment, setIsTestPayment] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    setIsTestPayment(type === "test");

    toast.error("Thanh toán đã bị huỷ.");

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          navigate("/booking/doctors");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [navigate, searchParams]);

  const handleGoBack = () => {
    navigate("/booking/doctors");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleMyAppointments = () => {
    if (isTestPayment) {
      navigate("/account-settings/medical-records-history");
    } else {
      navigate("/my-appointments");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            Thanh toán đã bị huỷ
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {isTestPayment
              ? "Thanh toán xét nghiệm đã bị huỷ. Bạn có thể thử lại hoặc kiểm tra lịch sử xét nghiệm của mình."
              : "Thanh toán đặt lịch khám đã bị huỷ. Bạn có thể thử lại hoặc kiểm tra lịch hẹn của mình."}
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Tự động chuyển về trang chọn bác sĩ sau{" "}
              <span className="font-bold text-amber-800">{countdown}s</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại chọn bác sĩ
          </button>

          <button
            onClick={handleMyAppointments}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <Calendar className="w-4 h-4" />
            {isTestPayment ? "Xem lịch sử xét nghiệm" : "Xem lịch hẹn của tôi"}
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
