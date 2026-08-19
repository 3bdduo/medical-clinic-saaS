"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearTokens,
  getAccessToken,
  setTokens as persistTokens,
} from "@/lib/http";
import { login as loginRequest } from "@/lib/api/auth";
import type { JwtPayload, LoginPayload, Role } from "@/types/api";

interface AuthState {
  role: Role | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<Role>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payloadPart = token.split(".")[1];
    const json = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    role: null,
    userId: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const payload = decodeJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setState({
          role: payload.role,
          userId: payload.userId,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginRequest(payload);
    const { accessToken, refreshToken } = res.data;
    persistTokens(accessToken, refreshToken);
    const decoded = decodeJwt(accessToken);
    if (!decoded) throw new Error("Malformed token from server");
    setState({
      role: decoded.role,
      userId: decoded.userId,
      isAuthenticated: true,
      isLoading: false,
    });
    return decoded.role;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setState({ role: null, userId: null, isAuthenticated: false, isLoading: false });
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ ...state, login, logout }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
