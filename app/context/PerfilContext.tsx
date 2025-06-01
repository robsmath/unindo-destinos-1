"use client";


import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getUsuarioLogado } from "@/services/userService";
import { getPreferenciasDoUsuario } from "@/services/preferenciasService";
import { getMinhasViagens } from "@/services/viagemService";
import { getImage } from "@/services/unsplashService";
import { UsuarioDTO } from "@/models/UsuarioDTO";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { MinhasViagensDTO } from "@/models/MinhasViagensDTO";
import { useAuth } from "./AuthContext";

interface PerfilContextType {
  usuario: UsuarioDTO | null;
  preferencias: PreferenciasDTO | null;
  viagens: MinhasViagensDTO[];
  imagensViagens: { [key: number]: string };
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
  const [imagensViagens, setImagensViagens] = useState<{ [key: number]: string }>({});
  const [carregado, setCarregado] = useState(false);
  const { atualizarUsuario, token, isAuthenticated, logout } = useAuth();  const carregarImagens = useCallback(async (viagensLista: MinhasViagensDTO[]) => {
    const novasImagens: { [key: number]: string } = {};
    
    await Promise.all(
      viagensLista.map(async ({ viagem }) => {        try {
          const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
          novasImagens[viagem.id] = imagem || "/images/common/beach.jpg";
        } catch (error) {
          console.warn(`Erro ao carregar imagem para viagem ${viagem.id}:`, error);
          novasImagens[viagem.id] = "/images/common/beach.jpg";
        }
      })
    );
    
    setImagensViagens(novasImagens);
  }, []);
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

      await carregarImagens(viagensRes);
    } catch (err: any) {
      console.error("Erro ao carregar perfil", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
      }
    }
  }, [isAuthenticated, carregado, atualizarUsuario, carregarImagens, logout]);  const atualizarViagens = useCallback(async () => {
    if (viagens.length > 0 && carregado) {
      return;
    }

    try {
      const viagensRes = await getMinhasViagens();
      setViagens(viagensRes);
      await carregarImagens(viagensRes);
    } catch (err) {
      console.error("Erro ao atualizar viagens", err);
    }
  }, [viagens.length, carregado, carregarImagens]);

  const recarregarViagens = useCallback(async () => {
    try {
      const viagensRes = await getMinhasViagens();
      setViagens(viagensRes);
      await carregarImagens(viagensRes);
    } catch (err) {
      console.error("Erro ao recarregar viagens", err);
    }  }, [carregarImagens]);
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
      });    } catch (err: any) {
      console.error("Erro ao carregar dados do usuário", err);
      // Interceptor da API vai cuidar dos erros 401/403
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
      setPreferencias(preferenciasRes);    } catch (err: any) {
      console.error("Erro ao carregar preferências", err);
      // Interceptor da API vai cuidar dos erros 401/403
    }
  }, [isAuthenticated, preferencias, carregado, logout]);
  useEffect(() => {
    if (isAuthenticated && !carregado) {
      carregarPerfil();
    } else if (!isAuthenticated) {
      setUsuario(null);
      setPreferencias(null);
      setViagens([]);
      setImagensViagens({});
      setCarregado(false);
    }
  }, [isAuthenticated, carregado, carregarPerfil]);

  return (    <PerfilContext.Provider
      value={{
        usuario,
        preferencias,
        viagens,
        imagensViagens,
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
