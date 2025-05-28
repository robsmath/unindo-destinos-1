"use client";


import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getUsuarioLogado } from "@/services/userService";
import { getPreferenciasDoUsuario } from "@/services/preferenciasService";
import { getMinhasViagens } from "@/services/viagemService";
import { getImage } from "@/services/googleImageService";
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
  const { atualizarUsuario, token, isAuthenticated, logout } = useAuth();
  const carregarImagens = useCallback(async (viagensLista: MinhasViagensDTO[]) => {
    const novasImagens: { [key: number]: string } = {};
    
    // Função auxiliar para tentar carregar uma imagem com retry
    const carregarImagemComRetry = async (viagem: any, maxTentativas = 3): Promise<string> => {
      const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
      
      for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
        try {
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
          if (imagem) {
            return imagem;
          }
        } catch (error: any) {
          console.warn(`Tentativa ${tentativa} falhou para viagem ${viagem.id}:`, error);
          
          // Se não é a última tentativa, aguarda um pouco antes de tentar novamente
          if (tentativa < maxTentativas) {
            await new Promise(resolve => setTimeout(resolve, 1000 * tentativa)); // Delay exponencial
          }
        }
      }
      
      // Se todas as tentativas falharam, retorna a imagem padrão
      return "/images/common/beach.jpg";
    };

    await Promise.all(
      viagensLista.map(async ({ viagem }) => {
        try {
          novasImagens[viagem.id] = await carregarImagemComRetry(viagem);
        } catch {
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
    // Se já temos viagens carregadas, não precisa recarregar
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

    // Se já temos dados do usuário, não precisa recarregar (exceto se forçado)
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
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
      }
    }
  }, [isAuthenticated, usuario, carregado, atualizarUsuario, logout]);
    const carregarPreferencias = useCallback(async (forcar: boolean = false) => {
    if (!isAuthenticated) {
      console.warn("Usuário não autenticado. Não é possível carregar preferências.");
      return;
    }

    // Se já temos preferências carregadas, não precisa recarregar (exceto se forçado)
    if (preferencias && carregado && !forcar) {
      return;
    }

    try {
      const preferenciasRes = await getPreferenciasDoUsuario();
      setPreferencias(preferenciasRes);    } catch (err: any) {
      console.error("Erro ao carregar preferências", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
      }
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
