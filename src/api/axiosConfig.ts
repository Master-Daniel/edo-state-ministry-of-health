import { getCookie } from '../utils/custom-functions';
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRateLimit from 'axios-rate-limit';

// Define the type for the response data you expect
interface ResponseData {
    message?: string;
    // Add other properties as per your response structure
}

const axiosInstance = axiosRateLimit(
    axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
        withCredentials: true,
        // timeout: 10000,
    }),
    { maxRPS: 5 }
);

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getCookie('edo-state-token');
        if (token) {
            config.headers = config.headers || {}; // Ensure headers is defined
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ResponseData>) => {
        return response;
    },
    (error: AxiosError<ResponseData>) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/auth/login?redirect=${currentPath}`;
        }

        const res = error.response?.data ?? { message: 'Something went wrong' };
        return Promise.reject(res);
    }
);

export default axiosInstance;
