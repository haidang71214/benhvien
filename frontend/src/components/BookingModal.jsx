import React from "react";
import { formatDate } from "../utils/dateUtils";
import {
  X,
  User,
  Award,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  MessageCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const BookingModal = ({
  show,
  onClose,
  onConfirm,
  docInfo,
  selectedDate,
  selectedTime,
  initialSymptom,
  conversationId,
  onChatAction,
  isLoading,
}) => {
  if (!show) return null;

  const InfoRow = ({ icon: Icon, label, value, iconColor }) => (
    <div className="flex items-start gap-3 py-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Xác nhận đặt lịch
                </h2>
                <p className="text-sm text-gray-600">
                  Kiểm tra thông tin trước khi thanh toán
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-1 max-h-96 overflow-y-auto">
          {/* Important Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Lưu ý quan trọng
                </p>
                <p className="text-sm text-amber-700">
                  Vui lòng có mặt trước{" "}
                  <span className="font-semibold">15-30 phút</span> so với giờ
                  hẹn để làm thủ tục và chuẩn bị khám bệnh.
                </p>
              </div>
            </div>
          </div>

          <InfoRow
            icon={User}
            label="Bác sĩ"
            value={docInfo?.userName || docInfo?.name}
            iconColor="bg-blue-100 text-blue-600"
          />

          <InfoRow
            icon={Award}
            label="Chuyên khoa"
            value={
              Array.isArray(docInfo?.speciality)
                ? docInfo.speciality.join(", ")
                : docInfo?.speciality
            }
            iconColor="bg-purple-100 text-purple-600"
          />

          <InfoRow
            icon={Calendar}
            label="Ngày khám"
            value={selectedDate ? formatDate(selectedDate) : "Chưa chọn"}
            iconColor="bg-green-100 text-green-600"
          />

          <InfoRow
            icon={Clock}
            label="Giờ khám"
            value={selectedTime || "Chưa chọn"}
            iconColor="bg-orange-100 text-orange-600"
          />

          <InfoRow
            icon={FileText}
            label="Triệu chứng ban đầu"
            value={
              initialSymptom || (
                <span className="italic text-gray-400">Không có thông tin</span>
              )
            }
            iconColor="bg-indigo-100 text-indigo-600"
          />

          {/* Fee Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Tổng phí khám
                </p>
                <p className="text-xl font-bold text-emerald-800">
                  {docInfo?.fees
                    ? `${docInfo.fees.toLocaleString()}đ`
                    : "Miễn phí"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Button */}
          <div className="pt-4">
            <button
              onClick={onChatAction}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl border border-blue-200 transition-all duration-200 disabled:opacity-50"
            >
              <MessageCircle className="w-4 h-4" />
              {conversationId
                ? "Tiếp tục chat với bác sĩ"
                : "Bắt đầu chat với bác sĩ"}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={(e) => onConfirm(e)} // truyền sự kiện rõ ràng xuống
              disabled={isLoading}
              className="flex-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Xác nhận & Thanh toán</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
