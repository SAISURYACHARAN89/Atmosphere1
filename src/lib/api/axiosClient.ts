import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_API_URL,
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Login failed";

    return Promise.reject(new Error(message));
  }
);


export default axiosClient;
