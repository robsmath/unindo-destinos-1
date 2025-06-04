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
    setUsuarioSelecionado(usuario);
    setDenunciaModalOpen(true);
  };

  const fecharDenunciaModal = () => {
    setDenunciaModalOpen(false);
    setUsuarioSelecionado(null);
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
    // Após enviar denúncia, perguntar se quer bloquear
    fecharDenunciaModal();
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
    // Callback chamado quando usuário é bloqueado diretamente
    fecharBloqueioModal();
  };

  return {
    // Estados dos modais
    denunciaModalOpen,
    bloqueioModalOpen,
    perguntaBloqueioModalOpen,
    usuarioSelecionado,
    
    // Funções para abrir modais
    abrirDenunciaModal,
    abrirBloqueioModal,
    
    // Funções para fechar modais
    fecharDenunciaModal,
    fecharBloqueioModal,
    fecharPerguntaBloqueioModal,
    
    // Handlers de eventos
    handleDenunciaEnviada,
    handleBloquearAposDenuncia,
    handleNaoBloquearAposDenuncia,
    handleUsuarioBloqueado,
  };
} 