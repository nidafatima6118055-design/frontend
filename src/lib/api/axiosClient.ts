// src/lib/api/axiosClient.ts
import axios from "axios";
import Cookies from "js-cookie";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
let csrfPromise: Promise<any> | null = null;
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // ✅ send cookies automatically
    headers: { "Content-Type": "application/json" },
});



export const ensureCsrfToken = async () => {
    try {
        if (Cookies.get("csrftoken")) return;
        if (!csrfPromise) {
            csrfPromise = axios.get(`${BASE_URL}/api/auth/csrf/`, { withCredentials: true });
        }
        await csrfPromise;
    } catch (err) {
        console.warn("⚠️ Failed to fetch CSRF token", err);
    }
};



let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token?: string) => void;
    reject: (err?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token ?? undefined);
    });
    failedQueue = [];
};



api.interceptors.request.use(async (config) => {
    // Make sure csrf cookie exists
    await ensureCsrfToken();
    const csrfToken = Cookies.get("csrftoken");
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("⚠️ Axios Interceptor Triggered", error?.response?.status, error?.response?.data);
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);


        // Skip self-refresh retry loops
        if (originalRequest.url?.includes("/token/refresh/")) {
            return Promise.reject(error);
        }


        // If 401 and not retried yet → try refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = Cookies.get("refresh");

            // if (!refresh) return Promise.reject(error);
            // Prevent multiple refresh calls at the same time
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {


                const resp = await api.post("/api/auth/token/refresh/");

                const newAccess = resp.data?.data?.access;
                const newRefresh = resp.data?.data?.refresh;

                if (newAccess) {
                    Cookies.set("access", newAccess, { sameSite: "Lax", path: "/" });
                }
                if (newRefresh) {
                    Cookies.set("refresh", newRefresh, { sameSite: "Lax", path: "/" });
                }

                processQueue(null, newAccess);
                originalRequest.headers.Authorization = undefined; // only use cookies
                return api(originalRequest);
            } catch (err) {
                // Refresh failed → clear cookies
                Cookies.remove("access", { path: "/" });
                Cookies.remove("refresh", { path: "/" });
                processQueue(err, null);
                window.location.href = "/signin"; // optional
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
