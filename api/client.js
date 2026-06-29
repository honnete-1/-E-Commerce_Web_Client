import axios from "axios";
import { getGuestUserId } from "../utils/guestUser";

// Single centralized Axios instance. No component or hook in this app
// should import axios directly — everything goes through this client so
// base URL, headers, and error handling live in exactly one place.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: attach the persisted MongoDB userId to every
// request so the API can scope cart/orders correctly.
apiClient.interceptors.request.use((config) => {
  const userId = getGuestUserId();
  if (userId) {
    if (config.method === "get" || config.method === "delete") {
      config.params = { userId, ...config.params };
    } else {
      config.data = { userId, ...(config.data || {}) };
    }
  }
  return config;
});

// Response interceptor: normalize errors into a single shape so every
// useQuery/useMutation error handler can rely on error.message and
// error.status, regardless of what the API actually returned.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors?.[0]?.message;

    const normalized = new Error(
      serverMessage ||
        (status
          ? `Request failed with status ${status}`
          : "Network error — please check your connection and try again.")
    );
    normalized.status = status;
    normalized.original = error;

    return Promise.reject(normalized);
  }
);

export default apiClient;
