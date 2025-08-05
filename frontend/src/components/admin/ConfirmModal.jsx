import React from "react";

const ConfirmModal = ({ confirmModal, closeConfirmModal, confirmAction }) => {
  const getModalContent = () => {
    if (confirmModal.type === "delete") {
      return {
        title: "Xác nhận xóa người dùng",
        message: `Bạn có chắc chắn muốn xóa người dùng "${confirmModal.userName}" không? Hành động này không thể hoàn tác.`,
        confirmText: "Xóa",
        confirmClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      };
    } else if (confirmModal.type === "ban") {
      const action = confirmModal.userBlocked ? "mở khóa" : "khóa";
      return {
        title: `Xác nhận ${action} người dùng`,
        message: `Bạn có chắc chắn muốn ${action} người dùng "${confirmModal.userName}" không?`,
        confirmText: action === "khóa" ? "Khóa" : "Mở khóa",
        confirmClass: confirmModal.userBlocked
          ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
          : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
      };
    }
    return {};
  };

  if (!confirmModal.isOpen) return null;

  const modalContent = getModalContent();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            {modalContent.title}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">{modalContent.message}</p>
          </div>
          <div className="items-center px-4 py-3">
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${modalContent.confirmClass}`}
              >
                {modalContent.confirmText}
              </button>
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
