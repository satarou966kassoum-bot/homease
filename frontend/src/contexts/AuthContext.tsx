import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "../services/api";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "client" | "owner";
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("homease_user");
    const token = localStorage.getItem("homease_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  function persist(userData: User, token: string) {
    localStorage.setItem("homease_token", token);
    localStorage.setItem("homease_user", JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.data.user, data.data.token);
  }

  async function register(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "client" | "owner";
  }) {
    const { data } = await api.post("/auth/register", payload);
    persist(data.data.user, data.data.token);
  }

  function logout() {
    localStorage.removeItem("homease_token");
    localStorage.removeItem("homease_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  return ctx;
}
