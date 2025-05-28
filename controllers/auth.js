import { createRefTokenAsyncKey, createTokenAsyncKey } from '../config/jwt.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { users } from '../config/model/user.js';


// Đăng ký
const register = async (req, res) => {
  try {
    const { userName, password, email, age } = req.body;

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    const existingUser = await users.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email đã tồn tại' : 'Tên người dùng đã tồn tại',
      });
    }

    // Tạo user mới
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await users.create({
      userName,
      password: hashedPassword,
      email,
      age,
      role: 'patient',
    });


    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    // Tạo token
    const accessToken = await createTokenAsyncKey({ id: user._id, role: user.role });
    const refreshToken = await createRefTokenAsyncKey({ id: user._id, role: user.role });

    // Cập nhật refreshToken
    user.refreshToken = refreshToken;
    await user.save();

    // Thiết lập cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.status(200).json({
      message: 'Đăng nhập thành công',
      accessToken,
      user: { id: user._id, userName: user.userName, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
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
        role: 'patient',
      });
    } else if (!user.faceAppId) {
      // Cập nhật faceAppId nếu user đã tồn tại nhưng chưa có
      user.faceAppId = id;
      await user.save();
    }

    // Tạo token
    const accessToken = await createTokenAsyncKey({ id: user._id, role: user.role });
    const refreshToken = await createRefTokenAsyncKey({ id: user._id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Đăng nhập Facebook thành công',
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
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Gia hạn token
const extendToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Không tìm thấy refresh token' });
    }


    const user = await users.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ' });
    }


    const newAccessToken = await createTokenAsyncKey({ id: user._id, role: user.role });

    res.status(200).json({ message: 'Gia hạn token thành công', accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại' });
    }

    const resetToken = crypto.randomBytes(5).toString('hex');

    user.resetToken = resetToken;
    await user.save();

    // Gửi email
    const mailOption = {
      from: 'dangpnhde170023@fpt.edu.vn',
      to: email,
      subject: `Mã đặt lại mật khẩu: ${resetToken}`,
      text: `Xin chào ${user.userName},\n\nSử dụng mã này để đặt lại mật khẩu: ${resetToken}\n\nTrân trọng,`,
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Lỗi gửi email' });
      }
      res.status(200).json({ message: 'Gửi mã đặt lại mật khẩu thành công' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await users.findOne({ resetToken });
    if (!user) {
      return res.status(404).json({ message: 'Mã đặt lại không hợp lệ' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();

    res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đăng xuất
const logout = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    user.refreshToken = null;
    await user.save();

    // Xóa cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });

    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 
const updateMyself = async (req, res) => {
  try {

    const { userId } = req.user;
    const { userName, password, age } = req.body;
    const file = req.file;

    // Tìm user
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    if (userName) user.userName = userName;
    if (password) user.password = bcrypt.hashSync(password, 10);
    if (age) user.age = age;
    if (file) user.avatarUrl = file.path;

    await user.save();

    res.status(200).json({ message: 'Cập nhật thông tin thành công', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export {
  login,
  loginFacebook,
  extendToken,
  forgotPassword,
  resetPassword,
  register,
  logout,
  updateMyself,
};