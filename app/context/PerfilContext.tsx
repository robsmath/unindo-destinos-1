"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export const PerfilProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasDTO | null>(null);
  const [viagens, setViagens] = useState<MinhasViagensDTO[]>([]);
  const [imagensViagens, setImagensViagens] = useState<{ [key: number]: string }>({});
  const [carregado, setCarregado] = useState(false);

  const { atualizarUsuario, token } = useAuth();

  const carregarImagens = async (viagensLista: MinhasViagensDTO[]) => {
    const novasImagens: { [key: number]: string } = {};
    await Promise.all(
      viagensLista.map(async ({ viagem }) => {
        try {
          const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
          novasImagens[viagem.id] = imagem || "/images/common/beach.jpg";
        } catch {
          novasImagens[viagem.id] = "/images/common/beach.jpg";
        }
      })
    );
    setImagensViagens(novasImagens);
  };

  const carregarPerfil = async (forcar: boolean = false) => {
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

      if (token) {
        atualizarUsuario({
          id: usuarioRes.id!,
          nome: usuarioRes.nome,
          email: usuarioRes.email,
          fotoPerfil: usuarioRes.fotoPerfil,
        });
      }

      await carregarImagens(viagensRes);
    } catch (err) {
      console.error("Erro ao carregar perfil", err);
    }
  };

  const atualizarViagens = async () => {
    try {
      const viagensRes = await getMinhasViagens();
      setViagens(viagensRes);
      await carregarImagens(viagensRes);
    } catch (err) {
      console.error("Erro ao atualizar viagens", err);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  return (
    <PerfilContext.Provider
      value={{
        usuario,
        preferencias,
        viagens,
        imagensViagens,
        carregarPerfil,
        atualizarViagens,
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
