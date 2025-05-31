import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400">
      <img
        className="w-40 cursor-pointer"
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/")}
      />
      <ul className="hidden md:flex items-start font-medium gap-5">
        <NavLink to="/">
          <li className="py-1">Home</li>
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">Doctors</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Contact</li>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">About</li>
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 cursor-pointer relative group">
            <img className="w-8 rounded-full" src={user?.avatarUrl} alt="profile" />
            <span className="font-medium text-gray-700">{user?.userName}</span>
            <img src={assets.dropdown_icon} className="w-2.5" alt="dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={() => navigate("/my-profile")} className="hover:text-black cursor-pointer">
                  My Profile
                </p>
                <p onClick={() => navigate("/my-appointments")} className="hover:text-black cursor-pointer">
                  My Appointment
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="text-white px-4 md:px-8 py-2 md:py-3 rounded-full font-light bg-blue-500 text-xs md:text-sm"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
            <button
              className="text-blue-500 px-4 md:px-8 py-2 md:py-3 rounded-full font-light bg-white border border-blue-500 text-xs md:text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
