import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import CreateUserForm from "../components/admin/CreateUserForm";
import UsersTable from "../components/admin/UsersTable";
import ConfirmModal from "../components/admin/ConfirmModal";

const AdminUser = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    userId: null,
    userName: "",
    userBlocked: false,
  });

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.userName?.toLowerCase().includes(lowerSearchTerm) ||
        user.email?.toLowerCase().includes(lowerSearchTerm) ||
        user.role?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [users, searchTerm]);

  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/auth/login");
      return;
    }

    if (!user.role || user.role !== "admin") {
      console.log("User is not admin, redirecting to home");
      alert(
        "Bạn không có quyền truy cập trang admin. Chuyển hướng về trang chủ."
      );
      navigate("/");
      return;
    }

    console.log("User is admin, fetching users");
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/admin/getAllUser", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data.user);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/admin/createUser", formData, {
      });
      toast.success("Tạo người dùng thành công!");
      setFormData({
        userName: "",
        email: "",
        password: "",
        role: "patient",
      });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tạo người dùng. Vui lòng kiểm tra thông tin và thử lại."
      );
    }
  };

  const openConfirmModal = (type, userId, userName, userBlocked = false) => {
    setConfirmModal({
      isOpen: true,
      type,
      userId,
      userName,
      userBlocked,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      type: "",
      userId: null,
      userName: "",
      userBlocked: false,
    });
  };

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(`/admin/deleteUser/${confirmModal.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Xóa người dùng thành công!");
      fetchUsers();
      closeConfirmModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa người dùng.");
      closeConfirmModal();
    }
  };

  const handleChangeBlockToUser = async () => {
    try {
      await axiosInstance.post(`/admin/banUser/${confirmModal.userId}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Cập nhật trạng thái thành công!");
      fetchUsers();
      closeConfirmModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Vui lòng thử lại.");
      console.error("Error blocking/unblocking user:", err);
      closeConfirmModal();
    }
  };

  const confirmAction = () => {
    if (confirmModal.type === "delete") {
      handleDeleteUser();
    } else if (confirmModal.type === "ban") {
      handleChangeBlockToUser();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-700 text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePath={window.location.pathname} />
      <div className="flex-1 md:p-10 mt-16 md:mt-20 lg:mt-[50px]">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-8 text-center border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý người dùng
            </h1>
          </div>

          <div className="p-8">
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                {showCreateForm ? "Đóng form" : "Tạo người dùng mới"}
              </button>
            </div>

            {showCreateForm && (
              <CreateUserForm
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                formData={formData}
                handleInputChange={handleInputChange}
                handleCreateUser={handleCreateUser}
                error={error}
              />
            )}

            {searchTerm && (
              <div className="mb-4 text-sm text-gray-600">
                Tìm thấy {filteredUsers.length} kết quả cho "{searchTerm}"
                {filteredUsers.length === 0 && (
                  <span className="text-red-600 ml-2">
                    - Không tìm thấy người dùng nào phù hợp
                  </span>
                )}
              </div>
            )}

            {error && !showCreateForm && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <UsersTable
              users={filteredUsers}
              openConfirmModal={openConfirmModal}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        confirmModal={confirmModal}
        closeConfirmModal={closeConfirmModal}
        confirmAction={confirmAction}
      />
    </div>
  );
};

export default AdminUser;