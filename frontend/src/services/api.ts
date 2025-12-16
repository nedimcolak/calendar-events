import axios, { AxiosError, type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

let isHandling401 = false;

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isHandling401) {
      if (window.location.pathname !== "/login") {
        isHandling401 = true;

        window.location.href = "/login";

        setTimeout(() => {
          isHandling401 = false;
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
