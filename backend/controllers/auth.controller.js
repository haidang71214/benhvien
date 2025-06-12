import { createRefTokenAsyncKey, createTokenAsyncKey } from "../config/jwt.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { users } from "../model/user.js";
import transporter from "../config/email/transporter.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }

    const existingUser = await users.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email đã tồn tại"
            : "Tên người dùng đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = crypto.randomBytes(3).toString("hex"); // 6 ký tự
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    const newUser = await users.create({
      userName,
      email,
      password: hashedPassword,
      role: "patient",
      otpCode,
      otpExpires,
      isVerified: false,
    });

    const mailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Xác thực email đăng ký",
      text: `Xin chào ${userName}, mã xác thực của bạn là: ${otpCode}. Mã này sẽ hết hạn sau 10 phút.`,
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
      email,
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const user = await users.findOne({ email });

    if (!user) return res.status(404).json({ message: "Email không tồn tại" });
    if (user.isVerified)
      return res.status(400).json({ message: "Email đã được xác thực" });

    if (user.otpCode !== otpCode || new Date() > user.otpExpires) {
      return res
        .status(400)
        .json({ message: "Mã OTP không đúng hoặc đã hết hạn" });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Xác thực email thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email không tồn tại" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo token
    const accessToken = await createTokenAsyncKey({
      id: user._id,
      role: user.role,
    });
    const refreshToken = await createRefTokenAsyncKey({
      id: user._id,
      role: user.role,
    });

    // Cập nhật refreshToken
    user.refreshToken = refreshToken;
    await user.save();

    console.log("🍪 Setting refresh token cookie...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Refresh token length:", refreshToken.length);

    // Thiết lập cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: "/",
    });

    console.log("✅ Cookie set successfully");
    console.log("Response headers:", res.getHeaders());

    res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        age: user.age,
      },
    });
    console.log("📤 Login response sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đăng nhập qua Facebook
const loginFacebook = async (req, res) => {
  try {
    const { id, fullName, email } = req.body;

    // Tìm user theo email hoặc faceAppId
    let user = await users.findOne({ $or: [{ email }, { faceAppId: id }] });

    if (!user) {
      // Tạo user mới nếu không tồn tại
      user = await users.create({
        userName: fullName,
        email,
        faceAppId: id,
        role: "patient",
      });
    } else if (!user.faceAppId) {
      // Cập nhật faceAppId nếu user đã tồn tại nhưng chưa có
      user.faceAppId = id;
      await user.save();
    }

    // Tạo token
    const accessToken = await createTokenAsyncKey({
      id: user._id,
      role: user.role,
    });
    const refreshToken = await createRefTokenAsyncKey({
      id: user._id,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Đăng nhập Facebook thành công",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Gia hạn token
const extendToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken in cookie:", refreshToken); // Debug
    if (!refreshToken) {
      return res.status(401).json({ message: "Không tìm thấy refresh token" });
    }

    const user = await users.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ message: "Refresh token không hợp lệ" });
    }

    const newAccessToken = await createTokenAsyncKey({
      id: user._id,
      role: user.role,
    });

    res.status(200).json({
      message: "Gia hạn token thành công",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút
    await user.save();

    // Lấy host và protocol từ request headers
    const protocol = "http";
    const host = "localhost:5173";
    const resetUrl = `${protocol}://${host}/reset-password/${resetToken}`;

    // Gửi email
    const mailOption = {
      from: "dangpnhde170023@fpt.edu.vn",
      to: email,
      subject: `Đặt lại mật khẩu`,
      text: `Xin chào ${user.userName},\n\nNhấn vào link sau để đặt lại mật khẩu: ${resetUrl}\n\nLink sẽ hết hạn sau 15 phút.\n\nTrân trọng,`,
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Lỗi gửi email" });
      }
      res.status(200).json({
        message: "Đã gửi link đặt lại mật khẩu đến email của bạn",
        resetUrl,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await users.findOne({ resetToken });
    if (!user) {
      return res.status(404).json({ message: "Mã đặt lại không hợp lệ" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đăng xuất
const logout = async (req, res) => {
  try {
    // Lấy refreshToken từ cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy refreshToken trong cookie" });
    }

    // Tìm user theo refreshToken
    const user = await users.findOne({ refreshToken });
    if (!user) {
      // Dù không có user, vẫn xóa cookie (để đảm bảo frontend được logout)
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      return res.status(200).json({ message: "Đăng xuất thành công" });
    }

    // Xóa refreshToken trong DB
    user.refreshToken = null;
    await user.save();

    // Xóa cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//
const updateMyself = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const { userName, password, age } = req.body;
    const file = req.file;

    // Tìm user
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (userName) user.userName = userName;
    if (age) user.age = age;
    if (file) user.avatarUrl = file.path;

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
      }
      user.password = bcrypt.hashSync(newPassword, 10);
    }

    await user.save();

    res.status(200).json({ message: "Cập nhật thông tin thành công", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/v1/auth/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await users.findOne({ googleId: profile.id });
        if (!user) {
          user = await users.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
          } else {
            const randomPassword = crypto.randomBytes(16).toString("hex");
            user = new users({
              googleId: profile.id,
              userName: profile.displayName,
              email: profile.emails[0].value,
              password: randomPassword,
              role: "patient",
              isVerified: true, // Automatically verify new users
              avatarUrl: profile.photos ? profile.photos[0].value : null,
            });
          }
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export {
  login,
  loginFacebook,
  extendToken,
  forgotPassword,
  resetPassword,
  register,
  logout,
  updateMyself,
  verifyEmail,
};
