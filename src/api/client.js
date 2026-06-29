import axios from "axios";
import { getGuestUserId } from "../utils/guestUser";

// This is our central Axios client that connects to the live Railway API
const apiClient = axios.create({
  // Use the environment variable if it exists, otherwise fall back to the live API URL
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://e-commas-apis-production-e0f8.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// We add an interceptor to automatically attach the guest ID to every request!
// This makes it so we don't have to manually pass the guestId in every single API call.
apiClient.interceptors.request.use((config) => {
  const guestId = getGuestUserId();
  if (guestId) {
    config.headers["x-guest-id"] = guestId;
  }
  return config;
});

// We add a response interceptor to normalize errors
// This guarantees our hooks always receive a clean error message string instead of a messy Axios error object.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the API sent us a specific error message, use it!
    const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
