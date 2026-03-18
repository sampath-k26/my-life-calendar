const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getToken = () => localStorage.getItem("life-calendar-token");

type RequestOptions = RequestInit & {
  isFormData?: boolean;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (!options.isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "Something went wrong");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const setStoredToken = (token: string) => {
  localStorage.setItem("life-calendar-token", token);
};

export const clearStoredToken = () => {
  localStorage.removeItem("life-calendar-token");
};

export const getAssetUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};
