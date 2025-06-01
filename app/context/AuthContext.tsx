"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getUsuarioLogado } from "@/services/userService";
import { setLogoutCallback } from "@/services/api";
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
  logout: (redirectToLogin?: boolean) => void;
  atualizarFotoPerfil: (url: string) => void;
  atualizarUsuario: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  const logout = (redirectToLogin: boolean = true) => {
    limparSessao(false, redirectToLogin);
  };

  const limparSessao = (mostrarToast = false, redirect = true) => {
    Cookies.remove("token");
    setToken(null);
    setUsuario(null);
    if (mostrarToast) {
      toast.error("Sua sessão expirou. Faça login novamente.");
    }
    if (redirect) {
      router.push("/auth/signin");
    }
  };

  useEffect(() => {
    // Registrar o callback de logout no interceptor da API
    setLogoutCallback(() => logout(true));

    const verificarAuth = async () => {
      const storedToken = Cookies.get("token");
      if (storedToken) {
        try {
          const user = await getUsuarioLogado();
          setToken(storedToken);
          setUsuario({
            id: user.id!,
            nome: user.nome,
            email: user.email,
            fotoPerfil: user.fotoPerfil,
          });
        } catch {
          limparSessao(false, false);
        }
      }
      setCarregando(false);
    };

    verificarAuth();
  }, []);

  const login = (newToken: string, usuario: Usuario) => {
    Cookies.set("token", newToken, { expires: 7, sameSite: "Lax" });
    setToken(newToken);
    setUsuario(usuario);
    router.push("/profile");
  };

  const atualizarUsuario = (usuario: Usuario) => {
    setUsuario(usuario);
  };

  const atualizarFotoPerfil = (novaUrl: string) => {
    if (usuario) {
      const atualizado = { ...usuario, fotoPerfil: novaUrl };
      atualizarUsuario(atualizado);
    }
  };

  const isAuthenticated = !!token && !!usuario;

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

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
