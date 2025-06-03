import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/navbar";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <HeroNavbar
      shouldHideOnScroll
      isBordered
      className="px-4 md:px-8 py-4 bg-white backdrop-blur-sm fixed top-0 left-0 w-full z-50 shadow-md"
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
            Home
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
              }`
            }
          >
            Doctors
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-4 py-2 text-base font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                isActive ? "text-blue-600 bg-gray-100" : "text-gray-700"
              }`
            }
          >
            Contact
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
            About
          </NavLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="flex items-center gap-4" justify="end">
        <NavbarMenuToggle
          className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Toggle navigation menu"
        />

        <div className="hidden md:flex items-center gap-4">
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
                      onClick={() => navigate("/my-profile")}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/my-appointments")}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      My Appointments
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Sign Out
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
                  Log In
                </button>
                <button
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => navigate("/auth/register")}
                >
                  Get Started
                </button>
              </div>
            </NavbarItem>
          )}
        </div>
      </NavbarContent>
    </HeroNavbar>
  );
};

export default Navbar;