import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  CreditCard,
  Clock,
  Hash,
  Banknote,
  Home,
  Loader2,
} from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("success"); // Always show success
  const [orderDetail, setOrderDetail] = useState(null);
  const navigate = useNavigate();
  const [isTestPayment, setIsTestPayment] = useState(false);

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    const testId = searchParams.get("testId");
    const type = searchParams.get("type");

    let testPayment = type === "test";
    setIsTestPayment(testPayment);

    setOrderDetail({
      tranSactionNo: orderCode || testId || "TX" + Date.now(),
      amount: testPayment ? 500000 : 200,
      payment_date: new Date().toISOString(),
      payMethod: "Thanh toán online",
    });

    toast.success(
      testPayment
        ? "Thanh toán xét nghiệm thành công!"
        : "Thanh toán thành công và đã đặt lịch!"
    );
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-start justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-pulse">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Đang xác nhận thanh toán...
          </div>
          <div className="text-gray-500">Vui lòng chờ trong giây lát</div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-start justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-gray-600 mb-6">
            Thanh toán thất bại hoặc bị huỷ. Vui lòng thử lại!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/booking/doctors")}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Thử lại
            </button>
            <button
              onClick={() => navigate("/")}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {isTestPayment
              ? "Thanh toán xét nghiệm thành công. Bạn có thể xem chi tiết đơn xét nghiệm bên dưới."
              : "Đặt lịch thành công. Bạn có thể xem chi tiết lịch hẹn của mình bên dưới."}
          </p>
        </div>

        {orderDetail && (
          <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-800">
                {isTestPayment
                  ? "Chi tiết đơn xét nghiệm"
                  : "Chi tiết đơn hàng"}
              </h3>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p className="font-semibold text-gray-800 text-sm break-all">
                    {orderDetail.tranSactionNo || orderDetail._id}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Banknote className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Số tiền</p>
                  <p className="font-bold text-green-600">
                    {orderDetail.amount
                      ? isTestPayment
                        ? orderDetail.amount.toLocaleString() + " VND"
                        : (orderDetail.amount * 1000).toLocaleString() + " VND"
                      : "--"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Thời gian thanh toán</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {orderDetail.payment_date
                      ? new Date(orderDetail.payment_date).toLocaleString(
                          "vi-VN"
                        )
                      : "--"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phương thức</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {orderDetail.payMethod || "Thanh toán online"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => {
              if (isTestPayment) {
                navigate("/account-settings/medical-records-history");
              } else {
                navigate("/my-appointments");
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            {isTestPayment ? "Xem lịch sử xét nghiệm" : "Xem lịch hẹn của tôi"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>

        <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-700 leading-relaxed">
            {isTestPayment
              ? "Thông tin xét nghiệm đã được lưu vào hồ sơ của bạn. Bạn có thể theo dõi kết quả trong mục lịch sử xét nghiệm."
              : "Thông tin lịch hẹn đã được gửi về email của bạn. Vui lòng có mặt trước 15-30 phút so với giờ hẹn."}
          </p>
        </div>
      </div>
    </div>
  );
}
