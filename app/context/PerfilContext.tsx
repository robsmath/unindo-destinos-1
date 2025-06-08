"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getUsuarioLogado } from "@/services/userService";
import { getPreferenciasDoUsuario } from "@/services/preferenciasService";
import { getMinhasViagens } from "@/services/viagemService";
import { UsuarioDTO } from "@/models/UsuarioDTO";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { MinhasViagensDTO } from "@/models/MinhasViagensDTO";
import { useAuth } from "./AuthContext";

interface PerfilContextType {
  usuario: UsuarioDTO | null;
  preferencias: PreferenciasDTO | null;
  viagens: MinhasViagensDTO[];
  carregarPerfil: (forcar?: boolean) => Promise<void>;
  atualizarViagens: () => Promise<void>;
  recarregarViagens: () => Promise<void>;
  carregarUsuario: (forcar?: boolean) => Promise<void>;
  carregarPreferencias: (forcar?: boolean) => Promise<void>;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export const PerfilProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasDTO | null>(null);
  const [viagens, setViagens] = useState<MinhasViagensDTO[]>([]);
  const [carregado, setCarregado] = useState(false);
  const { atualizarUsuario, token, isAuthenticated, logout } = useAuth();

  const carregarPerfil = useCallback(async (forcar: boolean = false) => {
    if (!isAuthenticated) {
      console.warn("Usuário não autenticado. Não é possível carregar perfil.");
      return;
    }

    if (carregado && !forcar) return;

    try {
      const [usuarioRes, preferenciasRes, viagensRes] = await Promise.all([
        getUsuarioLogado(),
        getPreferenciasDoUsuario(),
        getMinhasViagens(),
      ]);

      setUsuario(usuarioRes);
      setPreferencias(preferenciasRes);
      setViagens(viagensRes);
      setCarregado(true);

      atualizarUsuario({
        id: usuarioRes.id!,
        nome: usuarioRes.nome,
        email: usuarioRes.email,
        fotoPerfil: usuarioRes.fotoPerfil,
      });
    } catch (err: any) {
      console.error("Erro ao carregar perfil", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
      }
    }
  }, [isAuthenticated, carregado, atualizarUsuario, logout]);

  const atualizarViagens = useCallback(async () => {
    if (viagens.length > 0 && carregado) {
      return;
    }

    try {
      const viagensRes = await getMinhasViagens();
      setViagens(viagensRes);
    } catch (err) {
      console.error("Erro ao atualizar viagens", err);
    }
  }, [viagens.length, carregado]);

  const recarregarViagens = useCallback(async () => {
    try {
      const viagensRes = await getMinhasViagens();
      setViagens(viagensRes);
    } catch (err) {
      console.error("Erro ao recarregar viagens", err);
    }
  }, []);

  const carregarUsuario = useCallback(async (forcar: boolean = false) => {
    if (!isAuthenticated) {
      console.warn("Usuário não autenticado. Não é possível carregar dados do usuário.");
      return;
    }

    if (usuario && carregado && !forcar) {
      return;
    }

    try {
      const usuarioRes = await getUsuarioLogado();
      setUsuario(usuarioRes);
      
      atualizarUsuario({
        id: usuarioRes.id!,
        nome: usuarioRes.nome,
        email: usuarioRes.email,
        fotoPerfil: usuarioRes.fotoPerfil,
      });
    } catch (err: any) {
      console.error("Erro ao carregar dados do usuário", err);
    }
  }, [isAuthenticated, usuario, carregado, atualizarUsuario, logout]);

  const carregarPreferencias = useCallback(async (forcar: boolean = false) => {
    if (!isAuthenticated) {
      console.warn("Usuário não autenticado. Não é possível carregar preferências.");
      return;
    }

    if (preferencias && carregado && !forcar) {
      return;
    }

    try {
      const preferenciasRes = await getPreferenciasDoUsuario();
      setPreferencias(preferenciasRes);
    } catch (err: any) {
      console.error("Erro ao carregar preferências", err);
    }
  }, [isAuthenticated, preferencias, carregado, logout]);

  useEffect(() => {
    if (isAuthenticated && !carregado) {
      carregarPerfil();
    } else if (!isAuthenticated) {
      setUsuario(null);
      setPreferencias(null);
      setViagens([]);
      setCarregado(false);
    }
  }, [isAuthenticated, carregado, carregarPerfil]);

  return (
    <PerfilContext.Provider
      value={{
        usuario,
        preferencias,
        viagens,
        carregarPerfil,
        atualizarViagens,
        recarregarViagens,
        carregarUsuario,
        carregarPreferencias,
      }}
    >
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = (): PerfilContextType => {
  const context = useContext(PerfilContext);
  if (!context) {
    throw new Error("usePerfil deve ser usado dentro de PerfilProvider");
  }
  return context;
};
