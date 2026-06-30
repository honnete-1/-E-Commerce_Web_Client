import axios from "axios";
import { getGuestUserId } from "../utils/guestUser";

// My central Axios client for the Railway API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://e-commas-apis-production-e0f8.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// I attach the guest ID to every request automatically
apiClient.interceptors.request.use((config) => {
  const guestId = getGuestUserId();
  if (guestId) {
    config.headers["x-guest-id"] = guestId;
  }
  return config;
});

// I normalize every error into a clean message string
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
