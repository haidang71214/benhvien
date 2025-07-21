import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [appointmentId, setAppointmentId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    const payStatus = searchParams.get("status");
    const isCancel = searchParams.get("cancel") === "true";

    if (!orderCode || isCancel || payStatus !== "PAID") {
      setStatus("failed");
      return;
    }

    // Call backend to create appointment and get order detail
    axiosInstance
      .get(`/api/v1/payment/payment-success?orderCode=${orderCode}`)
      .then((res) => {
        setStatus("success");
        setAppointmentId(res.data.appointmentId || res.data.id);
        setOrderDetail(res.data.order || res.data.data || null);
        toast.success("Thanh toán thành công và đã đặt lịch!");
        // No auto-redirect, show button instead
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
        <div className="flex flex-col items-center gap-3">
          <XCircle className="w-12 h-12 text-red-500" />
          <div className="text-lg text-red-600 font-semibold">
            Thanh toán thất bại hoặc bị huỷ. Vui lòng thử lại!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
        <div className="text-2xl font-bold text-green-700 mb-2">Thanh toán thành công!</div>
        <div className="text-gray-700 mb-4 text-center">Đặt lịch thành công. Bạn có thể xem chi tiết lịch hẹn của mình bên dưới.</div>
        {orderDetail && (
          <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-200 mb-2">
            <div className="font-semibold text-blue-700 mb-2">Chi tiết đơn hàng</div>
            <div className="flex flex-col gap-1 text-sm">
              <div><b>Mã đơn hàng:</b> {orderDetail.tranSactionNo || orderDetail._id}</div>
              <div><b>Số tiền:</b> {orderDetail.amount ? (orderDetail.amount * 1000).toLocaleString() + ' VND' : '--'}</div>
              <div><b>Thời gian thanh toán:</b> {orderDetail.payment_date ? new Date(orderDetail.payment_date).toLocaleString() : '--'}</div>
              <div><b>Phương thức:</b> {orderDetail.payMethod || '--'}</div>
            </div>
          </div>
        )}
        <button
          className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/my-appointments")}
        >
          Xem lịch hẹn của tôi
        </button>
      </div>
    </div>
  );
}
