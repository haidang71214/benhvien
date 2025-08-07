import { assets } from "../../assets/data/doctors";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import NotificationBell from "../NotificationBell";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SocketContext } from "../../context/socketProvider";
import { ChatWindow } from "../../pages/appointments/ChatWindow";
import SliderChatUser from "../../context/SliderChatUse";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { socket } = useContext(SocketContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("register", user.id);

    const handleNewMessage = (message) => {
      if (!isChatOpen && message.conversationId !== selectedConversationId) {
        setSelectedConversationId(message.conversationId);
        setIsChatOpen(true);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error("Lỗi socket: " + error.message);
    });

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("error");
    };
  }, [socket, user, selectedConversationId, isChatOpen]);

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedConversationId(null);
  };

  return (
    <HeroNavbar
      shouldHideOnScroll
      isBordered
      className="px-4 md:px-8 py-4 bg-white backdrop-blur-sm fixed top-0 left-0 right-0 w-full max-w-none z-50 shadow-md"
      maxWidth="full"
    >
      <NavbarContent justify="start" className="flex-shrink-0">
        <NavbarBrand
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center"
        >
          <img src={assets.logo} alt="Logo" className="w-32 h-auto" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-8 flex-1 justify-center">
        <NavbarItem>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
              }`
            }
          >
            Trang chủ
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            to="/booking/doctors"
            className={({ isActive }) =>
              `px-4 py-2 text-base font-semibold rounded-md transition-colors ${
                isActive
                  ? "text-blue-600 bg-gray-100"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              }`
            }
          >
            Đặt theo bác sĩ
          </NavLink>
        </NavbarItem>

        <NavbarItem>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
              }`
            }
          >
            Về chúng tôi
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            to="/ai-suggest"
            className={({ isActive }) =>
              `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
              }`
            }
          >
            AI Gợi ý Bác sĩ
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          {/* Admin-only link */}
          {user?.role === "admin" && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                  isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
                }`
              }
            >
              Trang quản trị
            </NavLink>
          )}
        </NavbarItem>
        <NavbarItem>
          {user?.role === "receptionist" && (
            <NavLink
              to="/receptionist-appointments"
              className={({ isActive }) =>
                `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                  isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
                }`
              }
            >
              Quản lý lịch khám{" "}
            </NavLink>
          )}
        </NavbarItem>

        <NavbarItem>
          {/* Nurse-only link */}
          {user?.role === "nurse" && (
            <NavLink
              to="/nurse-dashboard"
              className={({ isActive }) =>
                `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                  isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
                }`
              }
            >
              Trang y tá
            </NavLink>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="flex items-center gap-4" justify="end">
        <NavbarMenuToggle
          className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Toggle navigation menu"
        />

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && <NotificationBell />}
          {isAuthenticated ? (
            <NavbarItem>
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                  <img
                    src={user?.avatarUrl}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-base font-medium text-gray-800 group-hover:text-blue-600">
                    {user?.userName}
                  </span>
                </div>

                <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[180px]">
                  <div className="p-2">
                    <button
                      onClick={() => navigate("/account-settings")}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Cài đặt hồ sơ
                    </button>
                    <button
                      onClick={() => navigate("/my-appointments")}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Phiếu khám bệnh
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Các cuộc trò chuyện
                    </button>
                    {/* Only show for patients */}
                    {user?.role === "patient" && (
                      <button
                        onClick={() =>
                          navigate("/account-settings/medical-records-history")
                        }
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Lịch sử hồ sơ y tế
                      </button>
                    )}
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <div className="flex items-center gap-2">
                <button
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => navigate("/auth/login")}
                >
                  Đăng nhập{" "}
                </button>
                <button
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => navigate("/auth/register")}
                >
                  Đăng ký
                </button>
              </div>
            </NavbarItem>
          )}
        </div>
      </NavbarContent>
      {isChatOpen && (
        <>
          <SliderChatUser
            onClose={handleCloseChat}
            onSelectConversation={(conversationId) =>
              setSelectedConversationId(conversationId)
            }
          />
          {selectedConversationId && (
            <ChatWindow
              socket={socket}
              conversationId={selectedConversationId}
              userId={user?.id}
              onClose={handleCloseChat}
            />
          )}
        </>
      )}
    </HeroNavbar>
  );
};

export default Navbar;
