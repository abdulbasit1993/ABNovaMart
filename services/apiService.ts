import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/constants/apiUrl";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle errors globally
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data.message || "An error occured";

      console.log("Error status code: ", statusCode);

      if (statusCode === 401) {
        console.error("Unauthorized access. Please log in again.");
        toast.error("Unauthorized access. Please log in again.");
      } else if (statusCode === 500) {
        console.error("Server error - Try your request later");
        toast.error("Server error - Please try again later");
      } else {
        console.error(`Error code: ${statusCode} - ${errorMessage}`);
        toast.error(errorMessage);
      }
    } else if (error.request) {
      console.error("Network error - Check your internet connection");
      toast.error("Network error - Please check your internet connection");
    } else {
      console.error("Request error: ", error.message);
      toast.error(error.message);
    }

    return Promise.reject(error);
  },
);

export default apiService;
