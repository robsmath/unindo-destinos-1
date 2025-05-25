import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isLoggingOut = false;

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    const isPublicRoute =
      config.url === "/auth/login" ||
      config.url === "/auth/validar-email" ||
      (config.method === "post" && config.url === "/usuarios");

    if (token && config.headers && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const isAuthError = status === 401 || status === 403;

    if (typeof window !== "undefined" && isAuthError && !isLoggingOut) {
      const isOnAuthPage = window.location.pathname.startsWith("/auth");

      if (!isOnAuthPage) {
        isLoggingOut = true;

        toast.warning("Sua sessão expirou. Faça login novamente.");

        Cookies.remove("token");

        window.location.href = "/auth/signin?erro=expirado";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
