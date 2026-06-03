import axios from "axios";

const BASE_URL = "http://4.224.186.213/evaluation-service";

const credentials = {
  companyName: "Afford Medical Technologies Private Limited",
  clientID: "35fbf6ee-8396-4e37-a4e8-aaba81297596",
  clientSecret: "VMSwvypuRPGDMaNz",
  name: "anmol chauhan",
  email: "chauhananmol260305@gmail.com",
  rollNo: "2338408",
  accessCode: "nwwsKx"
};

let cachedToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function fetchNewToken(): Promise<string> {
  const response = await axios.post(`${BASE_URL}/auth`, credentials);
  const token = response.data.access_token;
  cachedToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("campus_notifications_token", token);
  }
  return token;
}

export function getToken(): string | null {
  if (cachedToken) return cachedToken;
  if (typeof window !== "undefined") {
    cachedToken = localStorage.getItem("campus_notifications_token");
  }
  return cachedToken;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    let token = getToken();
    if (!token) {
      try {
        token = await fetchNewToken();
      } catch (err) {
        console.error("Failed to fetch initial token:", err);
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // Retry once if 401 returned
    if (response && response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await fetchNewToken();
        isRefreshing = false;
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
