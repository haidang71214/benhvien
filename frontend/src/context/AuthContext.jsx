import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (accessToken) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    setUser(userData);
    setAccessToken(token);
    toast.success("Đăng nhập thành công !!!");
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/auth/logout");
      toast.success("Đăng xuất thành công !!!");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
      setAccessToken(null);
      window.location.href = "/";
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