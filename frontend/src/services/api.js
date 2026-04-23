import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

// Setiap request otomatis bawa token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Kalau token expired, auto logout
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const isLoginRequest = err.config?.url?.includes("/login");
        if (err.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export const authApi = {
    login: (username, password) => api.post("/login", { username, password }),
};

export const salesApi = {
    getAll: (params) => api.get("/sales", { params }),
};

export const predictApi = {
    predict: (data) => api.post("/predict", data),
};