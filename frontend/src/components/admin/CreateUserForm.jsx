import React from "react";

const CreateUserForm = ({
  showCreateForm,
  formData,
  handleInputChange,
  handleCreateUser,
  error,
}) => {
  return (
    <>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Tạo người dùng mới
          </h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên người dùng
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
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vai trò
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="patient">Bệnh nhân</option>
                <option value="doctor">Bác sĩ</option>
                <option value="receptionist">Lễ tân</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Tạo người dùng
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateUserForm;