import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

const AdminDashboard = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    console.log("Current user:", user); // Debug log
    console.log("User role:", user?.role); // Debug log

    if (!user) {
      console.log("No user found, redirecting to login"); // Debug log
      navigate("/auth/login");
      return;
    }

    // Check if role exists and is admin
    if (!user.role || user.role !== "admin") {
      console.log("User is not admin, redirecting to home"); // Debug log
      alert(
        "Bạn không có quyền truy cập trang admin. Chuyển hướng về trang chủ."
      );
      navigate("/");
      return;
    }

    console.log("User is admin, fetching users"); // Debug log
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/getAllUser",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data.user);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users. Please try again.", err);
      console.error("Error fetching users:", err);
      setLoading(false);
    }
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
    setError(""); // Clear previous errors
    try {
      await axios.post("http://localhost:8080/admin/createUser", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFormData({
        userName: "",
        email: "",
        password: "",
        role: "patient",
      });
      fetchUsers();
      // alert('User created successfully!'); // Keeping alert for feedback, can be replaced by a toast/snackbar
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create user. Please check the input and try again."
      );
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await axios.post(
        `http://localhost:8080/admin/updateUser/${editingUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEditingUser(null);
      setFormData({
        userName: "",
        email: "",
        password: "",
        role: "patient",
      });
      fetchUsers();
      // alert('User updated successfully!'); // Keeping alert for feedback
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:8080/admin/deleteUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        fetchUsers();
        // alert('User deleted successfully!'); // Keeping alert for feedback
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to delete user. Please try again."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-700 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePath={window.location.pathname} />
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-8 text-center border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>
          </div>

          <div className="p-8">
            {/* Create User Button */}
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                {showCreateForm ? "Cancel" : "Create New User"}
              </button>
            </div>

            {/* Create New User Section - Only show when showCreateForm is true */}
            {showCreateForm && (
              <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  {editingUser ? "Edit User" : "Create New User"}
                </h2>
                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <form
                  onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required={!editingUser}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Password is required for new users. Leave blank to keep
                      current password when editing.
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-start gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                      {editingUser ? "Update User" : "Create User"}
                    </button>
                    {editingUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setFormData({
                            userName: "",
                            email: "",
                            password: "",
                            role: "patient",
                          });
                          setError("");
                        }}
                        className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setFormData({
                                  userName: user.userName,
                                  email: user.email,
                                  password: "",
                                  role: user.role,
                                });
                                setShowCreateForm(true);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
