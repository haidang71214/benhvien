import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  // nhớ fix cái này
  const [appointmentId, setAppointmentId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const navigate = useNavigate();

  const [isTestPayment, setIsTestPayment] = useState(false);
  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    const testId = searchParams.get("testId");
    const payStatus = searchParams.get("status");
    const isCancel = searchParams.get("cancel") === "true";
    const type = searchParams.get("type");

    if ((!orderCode && !testId) || isCancel || payStatus !== "PAID") {
      setStatus("failed");
      return;
    }

    // Use type param to determine payment type
    let apiUrl = "";
    let testPayment = false;
    if (type === "test") {
      // Test payment (single or multi)
      if (orderCode) {
        apiUrl = `/test-assignment/pay-success?orderCode=${orderCode}`;
      } else if (testId) {
        apiUrl = `/test-assignment/pay-success?testId=${testId}`;
      }
      testPayment = true;
    } else {
      // Booking payment (appointment)
      if (orderCode) {
        apiUrl = `/payment/payment-success?orderCode=${orderCode}`;
      }
      testPayment = false;
    }
    setIsTestPayment(testPayment);

    axiosInstance
      .get(apiUrl)
      .then((res) => {
        setStatus("success");
        setAppointmentId(res.data.appointmentId || res.data.id);
        // For multi-test payments, use order.payment for payment info
        if (testPayment && res.data.order && res.data.order.payment) {
          setOrderDetail(res.data.order.payment);
        } else {
          setOrderDetail(res.data.order || res.data.data || null);
        }
        toast.success(testPayment ? "Thanh toán xét nghiệm thành công!" : "Thanh toán thành công và đã đặt lịch!");
      })
      .catch(() => {
        setStatus("failed");
        toast.error(testPayment ? "Không thể xác nhận thanh toán xét nghiệm." : "Không thể xác nhận thanh toán hoặc tạo lịch hẹn.");
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
        <div className="text-gray-700 mb-4 text-center">
          {isTestPayment
            ? 'Thanh toán xét nghiệm thành công. Bạn có thể xem chi tiết đơn xét nghiệm bên dưới.'
            : 'Đặt lịch thành công. Bạn có thể xem chi tiết lịch hẹn của mình bên dưới.'}
        </div>
        {orderDetail && (
          <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-200 mb-2">
            <div className="font-semibold text-blue-700 mb-2">
              {isTestPayment ? 'Chi tiết đơn xét nghiệm' : 'Chi tiết đơn hàng'}
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div><b>Mã đơn hàng:</b> {orderDetail.tranSactionNo || orderDetail._id}</div>
              <div><b>Số tiền:</b> {
                orderDetail.amount
                  ? (isTestPayment
                      ? orderDetail.amount.toLocaleString() + ' VND'
                      : (orderDetail.amount * 1000).toLocaleString() + ' VND')
                  : '--'
              }</div>
              <div><b>Thời gian thanh toán:</b> {orderDetail.payment_date ? new Date(orderDetail.payment_date).toLocaleString() : '--'}</div>
              <div><b>Phương thức:</b> {orderDetail.payMethod || '--'}</div>
            </div>
          </div>
        )}
        <button
          className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => {
            if (isTestPayment) {
              navigate("/account-settings/medical-records-history");
            } else {
              navigate("/my-appointments");
            }
          }}
        >
          {isTestPayment ? "Xem lịch sử xét nghiệm" : "Xem lịch hẹn của tôi"}
        </button>
      </div>
    </div>
  );
}
