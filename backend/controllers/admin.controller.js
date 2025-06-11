import bcrypt from "bcrypt";
import { users } from "../model/user.js";
// hàm để check admin
export const checkAdmin = async (userId) => {
  try {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại.");
    }
    if (user.role === "admin") {
      return true;
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền admin:", error.message);
    return false;
  }
};
export const checkDoctor = async (userId) => {
  try {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại.");
    }
    return user.role === "doctor";
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền doctor:", error.message);
    return false;
  }
};

export const checkPatients = async (userId) => {
  try {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại.");
    }
    if (user.role === "patient") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền admin:", error.message);
    return false;
  }
};
export const checkReceptionist = async (userId) => {
  try {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại.");
    }
    if (user.role === "receptionist") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền admin:", error.message);
    return false;
  }
};
// copy cái này làm register cũng được
const createUser = async (req, res) => {
  try {
    const { id } = req.user;
    if (checkAdmin(id)) {
      const { userName, password, role, email } = req.body;

      // Kiểm tra email hợp lệ bằng Regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ" });
      }

      // Kiểm tra email đã tồn tại chưa
      const checkUser = await users.findOne({ email });
      if (checkUser) {
        return res
          .status(400)
          .json({ message: "User đã tồn tại trong hệ thống" });
      }

      // Hash mật khẩu và tạo user mới
      const newUser = await users.create({
        userName,
        password: bcrypt.hashSync(password, 10),
        email,
        role,
      });

      res.status(201).json({ message: "Tạo user thành công", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, password } = req.body;
  const file = req.file;
  const userId = req.user.id;

  try {
    const isAdmin = await checkAdmin(userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện thao tác này." });
    }
    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // hơi sai 1 tí =))
    const updateData = {};
    if (userName) updateData.userName = userName;
    if (password) updateData.password = bcrypt.hashSync(password, 10);
    if (file) updateData.avatarUrl = file.path;

    await users.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Cập nhật người dùng thành công" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateSelf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, password } = req.body;
    const file = req.file;
    const findUser = await users.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      {
        userName: userName || findUser.userName,
        password: password ? bcrypt.hashSync(password, 10) : findUser.password,
        avartar: file ? file.path : findUser.avartar,
      },
      { new: true } // trả về user mới
    );
    return res
      .status(200)
      .json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    return res.status(500).json({ message: "Có lỗi xảy ra." });
  }
};

// xoá theo id của user đó
const deleteUser = async (req, res) => {
  // check admin
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const isAdmin = await checkAdmin(userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện thao tác này." });
    }

    const findUser = await users.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    await users.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: `Xóa thành công user ${findUser.userName}` });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// admin
const getAlluser = async (req, res) => {
  const userId = req.user.id;
  try {
    const isAdmin = await checkAdmin(userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện thao tác này." });
    }

    const user = await users.find();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//lấy toàn bộ bác sĩ
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await users.find({ role: "doctor" });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bác sĩ:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách bác sĩ" });
  }
};

// lấy chi tiết của người dùng, dùng cái này lấy chi tiết của thằng bác sĩ cũng được
const getDetailUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    if (checkAdmin(userId)) {
      const data = await users.findById(id);
      res.status(200).json({ data });
    } else {
      res.status(400).json("không có quyền");
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
// auth
const detailSelf = async (req, res) => {
  const userId = req.user.id;
  try {
    const findUser = await users.findById(userId);
    res.status(200).json({ findUser });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// search bệnh nhân cho admin và bác sĩ
const searchDoctors = async (req, res) => {
  try {
    // Lấy query tìm kiếm (userName hoặc email)
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }
    // Tìm bác sĩ theo userName hoặc email gần đúng (case-insensitive)
    const regex = new RegExp(q.trim(), "i");
    const doctors = await users.find({
      role: "doctor",
      $or: [{ userName: regex }, { email: regex }],
    });

    return res.status(200).json({ data: doctors });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm bác sĩ:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
// quản lí vật tư
// thay đổi role thành doctor, đồng thời set cái dữ liệu cho thằng doctor đó
const changeRoleUserToDoctor = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const isAdmin = await checkAdmin(admin_id);
    if (!isAdmin) {
      return res.status(403).json({ message: "Không có quyền" });
    }

    const { id } = req.params;
    const { specialty, licenseNumber, bio } = req.body;

    // Kiểm tra xem user cần đổi role có tồn tại không
    const targetUser = await users.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật role + thông tin bác sĩ
    const updatedUser = await users.findByIdAndUpdate(
      id,
      {
        role: "doctor",
        specialty,
        licenseNumber,
        bio,
      },
      { new: true } // Trả về document đã được cập nhật
    );

    return res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi server" });
  }
};

export {
  createUser,
  updateUser,
  deleteUser,
  getAlluser,
  getDetailUser,
  detailSelf,
  searchDoctors,
  changeRoleUserToDoctor,
  getAllDoctors,
};
