import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, 'Name cannot be null'],
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
  age: {
    type: Number,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  refreshToken: {
    type: String,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  faceAppId: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const users = mongoose.model('users', userSchema);
export { users };