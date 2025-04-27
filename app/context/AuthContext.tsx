"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
  id: number;
  nome: string;
  fotoPerfil?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  atualizarFotoPerfil: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    const storedFotoPerfil = localStorage.getItem("userFotoPerfil");

    if (storedToken) setToken(storedToken);
    if (storedUserName && storedUserId) {
      setUser({
        id: Number(storedUserId),
        nome: storedUserName,
        fotoPerfil: storedFotoPerfil || undefined,
      });
    }
  }, []);

  useEffect(() => {
    if (token) {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 401) {
            logout();
          }
          return Promise.reject(error);
        }
      );
      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    }
  }, [token]);

  const login = (newToken: string, user: User) => {
    Cookies.set("token", newToken, { expires: 7 });
    localStorage.setItem("userName", user.nome);
    localStorage.setItem("userId", user.id.toString());
    if (user.fotoPerfil) {
      localStorage.setItem("userFotoPerfil", user.fotoPerfil);
    }
    setToken(newToken);
    setUser(user);
    router.push("/profile");
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("userFotoPerfil");
    setToken(null);
    setUser(null);
    router.push("/auth/signin");
  };

  const atualizarFotoPerfil = (novaUrl: string) => {
    if (user) {
      const updatedUser = { ...user, fotoPerfil: novaUrl };
      setUser(updatedUser);
      localStorage.setItem("userFotoPerfil", novaUrl);
    }
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, atualizarFotoPerfil }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
