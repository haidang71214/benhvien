import mongoose, { mongo, Types } from "mongoose";
const { Schema } = mongoose;

export const ROLE_ENUM = ["patient", "admin", "doctor", "receptionist"];
export const STATUS_ENUM = ["InUse", "UnderMaintenance", "Broken", "Removed"];
export const DOCTOR_HEHE = [
  "internal_medicine",
  "pediatrics",
  "dermatology",
  "dentistry",
  "ENT",
  "ophthalmology",
  "cardiology",
  "neurology",
];
export const ROOM_ENUM = [
  "booked",
  "checkedIn",
  "inProgress",
  "completed",
  "cancelled",
];
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Name cannot be null"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dob: {
      type: String, // Store as string (e.g., "1990-01-01")
      default: null,
    },
    sex: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    role: {
      type: String,
      enum: ROLE_ENUM, // bỏ role user đi
      default: "patient",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
    avatarUrl: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png",
    },
    faceAppId: {
      type: String,
      default: null,
    },
    // những thuộc tính t bỏ dưới dòng này là những thuộc tính của doctor mới có
    specialty: {
      type: [String], // à, 1 bác sĩ có thể có nhiều chuyên ngành nên cái này mình để mảng thì hợp lí hơn
      enum: DOCTOR_HEHE,
    },
    licenseNumber: {
      type: String, // mã duy nhất của 1 bác sĩ được cấp phép
    },
    bio: {
      // mô tả
      type: String,
    },
  },
  { timestamps: true }
);

const users = mongoose.model("users", userSchema);
export { users };

// ADMIN
// Quyền truy cập: TẤT CẢ module – toàn quyền hệ thống
// Chức năng	Hành động được phép
// Quản lý người dùng	Thêm/sửa/xóa tất cả người dùng (bác sĩ, lễ tân, kế toán…)// oce
// Quản lý chuyên khoa	Quản lý danh sách chuyên khoa
// Quản lý bác sĩ	Gán chuyên khoa, cập nhật lịch làm việc
// Lịch làm việc	Quản lý lịch toàn bộ bác sĩ
// Vật tư y tế	Theo dõi, cập nhật kho, tạo giao dịch nhập - xuất sẽ làm
// Hồ sơ bệnh án	Truy cập mọi hồ sơ
// Thanh toán	Xem/tổng hợp hóa đơn
// Báo cáo	Truy xuất toàn bộ thống kê
// Cấu hình hệ thống	Phân quyền, cấu hình nhắc lịch,

// DOCTOR (Bác sĩ)
// Quyền truy cập: Giới hạn trong khuôn khổ chuyên môn cá nhân

// Chức năng	Hành động được phép
// Lịch khám	Xem lịch cá nhân
// Bệnh nhân	Xem danh sách bệnh nhân đã đăng ký khám với mình
// Hồ sơ bệnh án	Tạo & cập nhật chẩn đoán, đơn thuốc, cận lâm sàng
// Kê toa thuốc	Kê đơn, xem tồn kho cơ bản (để kê hợp lý)
// Cận lâm sàng	Gửi yêu cầu, xem kết quả
// Phản hồi	Xem đánh giá bệnh nhân về mình nhớ làm bảng phản hồi

// RECEPTIONIST (Lễ tân)
// Quyền truy cập: Quản lý lịch hẹn và tiếp đón bệnh nhân

// Chức năng	Hành động được phép
// Bệnh nhân	Thêm bệnh nhân mới
// Lịch hẹn	Đặt lịch, xác nhận, hủy, chuyển lịch
// Danh sách khám	Kiểm tra lịch từng bác sĩ trong ngày
// Thanh toán	Hỗ trợ tạo hóa đơn
// Gửi nhắc lịch	SMS, Zalo, hoặc email

// ACCOUNTANT (Kế toán)
// Quyền truy cập: Tài chính – hóa đơn – thống kê

// Chức năng	Hành động được phép
// Hóa đơn	Tạo, cập nhật, xuất hóa đơn
// Thanh toán	Kiểm tra tình trạng thanh toán
// Báo cáo doanh thu	Thống kê theo ngày/tháng/bác sĩ

// NURSE (Điều dưỡng)
// Quyền truy cập: Hỗ trợ bác sĩ – xử lý cận lâm sàng – cấp phát thuốc

// Chức năng	Hành động được phép
// Xem lịch khám	Chuẩn bị trước ca khám
// Cận lâm sàng	Nhận chỉ định – nhập kết quả
// Kho thuốc	Cấp phát thuốc – trừ kho
// Giao tiếp bệnh nhân	Giải thích hướng dẫn dùng thuốc, theo dõi sau khám

// PATIENT (Bệnh nhân)
// Quyền truy cập: Tài khoản cá nhân, lịch sử khá
// Chức năng	Hành động được phép
// Đặt lịch khám	hiện tại mình block cái này, vì lịch khám bác sĩ có thể không chủ động được
// Xem lịch khám
// Xem đơn thuốc
// Xem kết quả xét nghiệm	File đính kèm -> pdf
// Thanh toán	Trực tiếp hoặc quét mã
// Gửi phản hồi	Đánh giá bác sĩ, góp ý dịch vụ
// Nhận nhắc nhở	Lịch tái khám, thuốc

// làm thêm quả nhân viên tư vấn chat chít đồ
