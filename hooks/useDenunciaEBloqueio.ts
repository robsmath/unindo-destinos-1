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
    // NÃO limpar usuarioSelecionado aqui, pois ainda pode ser usado no modal de pergunta
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
    // Após enviar denúncia, perguntar se quer bloquear
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
      setUsuarioSelecionado(null); // Limpar apenas após todo o fluxo terminar
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
      toast.error("Erro ao bloquear usuário. Tente novamente.");
    }
  };

  const handleNaoBloquearAposDenuncia = () => {
    fecharPerguntaBloqueioModal();
    setUsuarioSelecionado(null); // Limpar apenas após todo o fluxo terminar
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