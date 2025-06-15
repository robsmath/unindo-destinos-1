"use client";

import { useState } from "react";
import { bloquearUsuario } from "@/services/usuarioBloqueadoService";
import { toast } from "sonner";

interface UsuarioInfo {
  id: number;
  nome: string;
}

export function useDenunciaEBloqueio() {
  const [denunciaModalOpen, setDenunciaModalOpen] = useState(false);
  const [bloqueioModalOpen, setBloqueioModalOpen] = useState(false);
  const [perguntaBloqueioModalOpen, setPerguntaBloqueioModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioInfo | null>(null);

  const abrirDenunciaModal = (usuario: UsuarioInfo) => {
    console.log("🚨 Abrindo modal de denúncia para:", usuario);
    setUsuarioSelecionado(usuario);
    setDenunciaModalOpen(true);
  };

  const fecharDenunciaModal = () => {
    setDenunciaModalOpen(false);
  };

  const abrirBloqueioModal = (usuario: UsuarioInfo) => {
    setUsuarioSelecionado(usuario);
    setBloqueioModalOpen(true);
  };

  const fecharBloqueioModal = () => {
    setBloqueioModalOpen(false);
    setUsuarioSelecionado(null);
  };

  const abrirPerguntaBloqueioModal = () => {
    setPerguntaBloqueioModalOpen(true);
  };

  const fecharPerguntaBloqueioModal = () => {
    setPerguntaBloqueioModalOpen(false);
  };

  const handleDenunciaEnviada = () => {
    console.log("🚨 handleDenunciaEnviada chamado");
    fecharDenunciaModal();
    console.log("🚨 Abrindo modal de pergunta de bloqueio");
    abrirPerguntaBloqueioModal();
  };

  const handleBloquearAposDenuncia = async () => {
    if (!usuarioSelecionado) return;
    
    try {
      await bloquearUsuario(usuarioSelecionado.id);
      toast.success(`${usuarioSelecionado.nome} foi bloqueado com sucesso!`);
      fecharPerguntaBloqueioModal();
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
      toast.error("Erro ao bloquear usuário. Tente novamente.");
    }
  };

  const handleNaoBloquearAposDenuncia = () => {
    fecharPerguntaBloqueioModal();
    setUsuarioSelecionado(null);
  };

  const handleUsuarioBloqueado = () => {
    fecharBloqueioModal();
  };

  return {
    denunciaModalOpen,
    bloqueioModalOpen,
    perguntaBloqueioModalOpen,
    usuarioSelecionado,
    
    abrirDenunciaModal,
    abrirBloqueioModal,
    
    fecharDenunciaModal,
    fecharBloqueioModal,
    fecharPerguntaBloqueioModal,
    
    handleDenunciaEnviada,
    handleBloquearAposDenuncia,
    handleNaoBloquearAposDenuncia,
    handleUsuarioBloqueado,
  };
} 