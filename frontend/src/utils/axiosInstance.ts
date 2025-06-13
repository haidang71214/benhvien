import axios from "axios";

export const BASE_URL = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

const authAxios = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const extendToken = async () => {
  try {
    console.log("🔄 Attempting to extend token...");

    const { data } = await authAxios.post(
      `/auth/extendToken`,
      {},
      { withCredentials: true }
    );

    console.log("✅ Token extended successfully");
    return data?.newAccessToken || null;
  } catch (error) {
    console.log(
      "❌ Extend token failed:",
      error.response?.status,
      error.response?.data
    );
    return null;
  }
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/extendToken")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await extendToken();

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          console.log("🔄 Retrying original request with new token");
          return axiosInstance(originalRequest);
        } else {
          console.log("🚪 Cannot extend token, redirecting to login");
          localStorage.removeItem("accessToken");
          processQueue(error, null);

          // Redirect to login
          // window.location.href = "/auth/login";
          // return Promise.reject(error);
        }
      } catch (err) {
        console.error("💥 Token renewal process failed:", err);
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        // window.location.href = "/login";
        // return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const fetchFromAPI = async (url: any) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching from API:", error);
    throw error;
  }
};

export const debugAuth = () => {
  console.log("=== AUTH DEBUG INFO ===");
  console.log("Access Token:", localStorage.getItem("accessToken"));
  console.log("All Cookies:", document.cookie);
  console.log("Base URL:", BASE_URL);
};
