import mongoose from "mongoose";
const { Schema } = mongoose;

export const ROLE_ENUM = ["patient", "admin", "doctor", "nurse"];
export const STATUS_ENUM = ["InUse", "UnderMaintenance", "Broken", "Removed"];
export const DOCTOR_HEHE = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
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
      type: Date,
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
    otpCode: String,
    otpExpires: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    faceAppId: {
      type: String,
      default: null,
    },
    // những thuộc tính t bỏ dưới dòng này là những thuộc tính của doctor mới có
    speciality: {
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
    degree: {
      type: String,
      default: "MBBS",
    },
    experience: {
      type: String,
      default: "N/A",
    },
    about: {
      type: String,
      default: "",
    },
    fees: {
      type: Number,
      default: 50,
    },
    block: {
      type: Boolean,
      default: false, 
    },
    availableSchedule: {
      type: Map,
      of: [String],
      default: () => ({
        Monday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        Tuesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        Wednesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        Thursday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        Friday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
      }),
    },
  },
  { timestamps: true }
);

const users = mongoose.model("User", userSchema);
export { users };