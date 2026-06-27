const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("authToken");
}

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${cleanPath}`;
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message = data?.message || data?.Message || data?.error || data?.Error || "خطا در ارتباط با سرور";
    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

export function unwrapApiData<T>(response: any): T {
  if (response?.Data !== undefined) return response.Data;
  if (response?.data !== undefined) return response.data;
  if (response?.result !== undefined) return response.result;

  return response as T;
}