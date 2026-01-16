import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor (optional, useful for auth tokens later)
api.interceptors.request.use(
    (config) => {
        // You can add auth headers here if needed from localStorage
        // const user = JSON.parse(localStorage.getItem('clinicUser'));
        // if (user?.token) {
        //     config.headers.Authorization = `Bearer ${user.token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
