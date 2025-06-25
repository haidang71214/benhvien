import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [appointmentId, setAppointmentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    const payStatus = searchParams.get("status");
    const isCancel = searchParams.get("cancel") === "true";

    if (!orderCode || isCancel || payStatus !== "PAID") {
      setStatus("failed");
      return;
    }

    // Call backend to create appointment
    axiosInstance
      .get(`/api/v1/payment/payment-success?orderCode=${orderCode}`)
      .then((res) => {
        setStatus("success");
        setAppointmentId(res.data.appointmentId || res.data.id);
        toast.success("Thanh toán thành công và đã đặt lịch!");
        setTimeout(() => {
          navigate("/my-appointments");
        }, 3000);
      })
      .catch(() => {
        setStatus("failed");
        toast.error("Không thể xác nhận thanh toán hoặc tạo lịch hẹn.");
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang xác nhận thanh toán...</div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          Thanh toán thất bại hoặc bị huỷ. Vui lòng thử lại!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-green-600">
        Thanh toán thành công! Đang chuyển đến chi tiết lịch hẹn...
      </div>
    </div>
  );
}
