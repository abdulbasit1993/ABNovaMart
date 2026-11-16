import { toast } from "sonner";
import { BASE_URL } from "@/constants/apiUrl";

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

interface ApiError extends Error {
  status?: number;
  data?: unknown;
  response?: {
    status: number;
    data: unknown;
  };
}

type RequestOptions = Omit<RequestInit, "method" | "body">;

const apiService = {
  async request<T = unknown>(
    method: string,
    endpoint: string,
    data: unknown = null,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem("authToken");

    const headers = new Headers({
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(options.headers).entries()),
    });

    // Attach authorization token
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      method,
      headers,
    };

    // Attach request body
    if (data !== null && data !== undefined) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      // Handle response data
      const contentType = response.headers.get("content-type");
      let responseData: unknown = null;

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        responseData = text || null;
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage =
          (responseData as { message?: string } | null)?.message ||
          "An error occurred";

        const error = new Error(errorMessage) as ApiError;

        error.status = response.status;
        error.data = responseData;
        error.response = {
          status: response.status,
          data: responseData,
        };

        console.log("Error status code: ", response.status);

        if (response.status === 401) {
          console.error("Unauthorized access. Please log in again.");
          toast.error("Unauthorized access. Please log in again.");
        } else if (response.status === 500) {
          console.error("Server error - Try your request later");
          toast.error("Server error - Please try again later");
        } else {
          console.error(`Error code: ${response.status} - ${errorMessage}`);
          toast.error(errorMessage);
        }

        throw error;
      }

      return {
        data: responseData as T,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      const apiError = error as ApiError;

      // Handle network errors separately
      if (!apiError.status) {
        if (error instanceof TypeError) {
          console.error("Network error - Check your internet connection");
          toast.error("Network error - Please check your internet connection");
        } else {
          console.error("Request error: ", apiError.message);
          toast.error(apiError.message);
        }
      }

      throw error;
    }
  },

  get<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, null, options);
  },

  post<T = unknown>(
    endpoint: string,
    data: unknown = null,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, data, options);
  },

  put<T = unknown>(
    endpoint: string,
    data: unknown = null,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, data, options);
  },

  patch<T = unknown>(
    endpoint: string,
    data: unknown = null,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, data, options);
  },

  delete<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, null, options);
  },
};

export default apiService;
