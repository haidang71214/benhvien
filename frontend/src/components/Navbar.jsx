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
      className="px-4 md:px-6 py-6 bg-white/90 backdrop-blur-sm"
    >
      {/* Logo (Left) */}
      <NavbarContent justify="start" className="flex-shrink-0">
        <NavbarBrand
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center"
        >
          <img src={assets.logo} alt="Logo" className="w-28 h-auto" />
        </NavbarBrand>
      </NavbarContent>

      {/* Navigation Links (Center) */}
      <NavbarContent className="hidden md:flex gap-6 flex-1" justify="center">
        <NavbarItem>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600"
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
              `px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600"
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
              `px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600"
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
              `px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            About
          </NavLink>
        </NavbarItem>
      </NavbarContent>

      {/* User / Auth Buttons (Right) */}
      <NavbarContent className="flex items-center gap-2" justify="end">
        {/* Mobile toggle icon */}
        <NavbarMenuToggle
          className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Toggle navigation menu"
        />

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <NavbarItem>
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <img
                    src={user?.avatarUrl}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    {user?.userName}
                  </span>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-100 rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px]">
                  <div className="p-2">
                    <button
                      onClick={() => navigate("/my-profile")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/my-appointments")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      My Appointments
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
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
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                  onClick={() => navigate("/auth/login")}
                >
                  Log In
                </button>
                <button
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
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