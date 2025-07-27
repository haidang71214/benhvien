import React from "react";

const UsersTable = ({ users, openConfirmModal }) => {
  const getRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "doctor":
        return "Bác sĩ";
      case "receptionist":
        return "Lễ tân";
      default:
        return "Bệnh nhân";
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên người dùng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vai trò
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                Không tìm thấy người dùng nào.
              </td>
            </tr>
          ) : (
            users.map((userData) => (
              <tr key={userData._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {userData.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {userData.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {getRoleDisplay(userData.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userData.block
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {userData.block ? "Đã khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        openConfirmModal(
                          "ban",
                          userData._id,
                          userData.userName,
                          userData.block
                        )
                      }
                      className={`font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 ${
                        userData.block
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-black border border-gray-300"
                      }`}
                    >
                      {userData.block ? "Mở khóa" : "Khóa"}
                    </button>

                    <button
                      onClick={() =>
                        openConfirmModal(
                          "delete",
                          userData._id,
                          userData.userName
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
