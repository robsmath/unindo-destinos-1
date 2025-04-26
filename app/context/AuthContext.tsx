"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  userName: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string, name: string, id: number | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
  
    if (storedToken) setToken(storedToken);
    if (storedUserName) setUserName(storedUserName);
    if (storedUserId) setUserId(Number(storedUserId));
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

  const login = (newToken: string, name: string, id: number | null) => { 
    Cookies.set("token", newToken, { expires: 7 });
    localStorage.setItem("userName", name);
    
    if (id !== null && id !== undefined) {
      localStorage.setItem("userId", id.toString());
      setUserId(id);
    } else {
      console.error("ID de usuário inválido no login:", id);
    }
  
    setToken(newToken);
    setUserName(name);
    router.push("/profile");
  };
  

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setToken(null);
    setUserName(null);
    setUserId(null);
    router.push("/auth/signin");
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, userName, userId, isAuthenticated, login, logout }}>
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
