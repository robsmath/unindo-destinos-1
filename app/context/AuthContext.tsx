"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  fotoPerfil?: string;
}

interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  atualizarFotoPerfil: (url: string) => void;
  atualizarUsuario: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedFotoPerfil = localStorage.getItem("userFotoPerfil");

    if (storedToken) setToken(storedToken);

    if (storedUserId && storedUserName && storedUserEmail) {
      setUsuario({
        id: Number(storedUserId),
        nome: storedUserName,
        email: storedUserEmail,
        fotoPerfil: storedFotoPerfil || undefined,
      });
    }
  }, []);

  useEffect(() => {
    if (token) {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error("Sua sessão expirou. Faça login novamente.");
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

  const login = (newToken: string, usuario: Usuario) => {
    Cookies.set("token", newToken, { expires: 7 });
    salvarUsuarioLocal(usuario);
    setToken(newToken);
    setUsuario(usuario);
    router.push("/profile");
  };

  const atualizarUsuario = (usuario: Usuario) => {
    salvarUsuarioLocal(usuario);
    setUsuario(usuario);
  };

  const salvarUsuarioLocal = (usuario: Usuario) => {
    localStorage.setItem("userId", usuario.id.toString());
    localStorage.setItem("userName", usuario.nome);
    localStorage.setItem("userEmail", usuario.email);

    if (usuario.fotoPerfil) {
      localStorage.setItem("userFotoPerfil", usuario.fotoPerfil);
    } else {
      localStorage.removeItem("userFotoPerfil");
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFotoPerfil");
    setToken(null);
    setUsuario(null);
    router.push("/auth/signin");
  };

  const atualizarFotoPerfil = (novaUrl: string) => {
    if (usuario) {
      const atualizado = { ...usuario, fotoPerfil: novaUrl };
      atualizarUsuario(atualizado);
    }
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        isAuthenticated,
        login,
        logout,
        atualizarFotoPerfil,
        atualizarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
