import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// If the session expires while the app is open, tell the app so it can show the login page.
// /auth/* calls handle their own 401s (wrong password, not logged in yet, etc.).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.startsWith("/auth/")) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  },
);

// Friendly message from any failed request
export const errorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (!error?.response) return "Can't reach the server. Check your connection.";
  return fallback;
};

export default api;
