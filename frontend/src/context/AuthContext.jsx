import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser || savedUser === "undefined") return null;
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Lỗi parse user từ localStorage:", error);
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    try {
      const token = localStorage.getItem("accessToken");
      return token && token !== "undefined" ? token : null;
    } catch (error) {
      console.error("Lỗi parse token từ localStorage:", error);
      return null;
    }
  });

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("http://localhost:8080/api/v1/auth/logout");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isAuthenticated, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
