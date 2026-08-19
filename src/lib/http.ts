// Central HTTP client for the clinic-saas backend.
// Base URL points at the deployed API (Vercel-hosted multi-tenant backend).

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== "undefined"
    ? "/api-proxy"
    : "https://multi-tenant-saas-ten.vercel.app");

const ACCESS_TOKEN_KEY = "clinic_access_token";
const REFRESH_TOKEN_KEY = "clinic_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean; // attach Authorization header (default: true)
  retry?: boolean; // internal flag to prevent infinite refresh loops
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const json = await res.json();
        const result = json?.data?.result ?? json?.data;
        if (result?.accessToken && result?.refreshToken) {
          setTokens(result.accessToken, result.refreshToken);
          return true;
        }
        return false;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, retry = false, headers, ...rest } = options;

  const isFormData =
    typeof FormData !== "undefined" && rest.body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders["Authorization"] = token;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      cache: "no-store",
    });
  } catch (err: any) {
    throw new ApiError(
      "تعذّر الاتصال بالسيرفر. يرجى التحقق من اتصال الإنترنت أو إعدادات الشبكة.",
      0,
      err
    );
  }

  let body: any = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (res.status === 401 && auth && !retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, retry: true });
    }
    clearTokens();
  }

  if (!res.ok) {
    const message =
      (body && (body.message || body.error)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}
