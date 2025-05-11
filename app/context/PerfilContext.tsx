"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUsuarioLogado } from "@/services/userService";
import { getPreferenciasDoUsuario } from "@/services/preferenciasService";
import { getMinhasViagens } from "@/services/viagemService";
import { getImage } from "@/services/googleImageService";
import { UsuarioDTO } from "@/models/UsuarioDTO";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { ViagemDTO } from "@/models/ViagemDTO";
import { useAuth } from "./AuthContext";


interface PerfilContextType {
  usuario: UsuarioDTO | null;
  preferencias: PreferenciasDTO | null;
  viagens: ViagemDTO[];
  imagensViagens: { [key: number]: string };
  carregarPerfil: () => Promise<void>;
  atualizarViagens: () => Promise<void>;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export const PerfilProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasDTO | null>(null);
  const [viagens, setViagens] = useState<ViagemDTO[]>([]);
  const [imagensViagens, setImagensViagens] = useState<{ [key: number]: string }>({});
  const { atualizarFotoPerfil } = useAuth();

  const carregarPerfil = async () => {
    try {
      const [usuarioRes, preferenciasRes, viagensRes] = await Promise.all([
        getUsuarioLogado(),
        getPreferenciasDoUsuario(),
        getMinhasViagens(),
      ]);
  
      setUsuario(usuarioRes);
      setPreferencias(preferenciasRes);
      setViagens(viagensRes);
  
      if (usuarioRes.fotoPerfil) {
        atualizarFotoPerfil(usuarioRes.fotoPerfil);
      }
  
      const novasImagens: { [key: number]: string } = {};
      await Promise.all(
        viagensRes.map(async (viagem) => {
          const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
          novasImagens[viagem.id] = imagem || "/images/common/beach.jpg";
        })
      );
      setImagensViagens(novasImagens);
    } catch (err) {
      console.error("Erro ao carregar perfil", err);
    }
  };
  

  const atualizarViagens = async () => {
    try {
      const viagensRes = await getMinhasViagens();
      setViagens(viagensRes);

      const novasImagens: { [key: number]: string } = {};
      await Promise.all(
        viagensRes.map(async (viagem) => {
          const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
          novasImagens[viagem.id] = imagem || "/images/common/beach.jpg";
        })
      );
      setImagensViagens(novasImagens);
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
