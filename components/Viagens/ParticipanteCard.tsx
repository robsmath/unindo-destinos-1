"use client";

import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { removerParticipanteDaViagem, sairDaViagem } from "@/services/viagemService";
import { useState } from "react";
import { Loader2, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import MiniPerfilModal from "@/components/EncontrePessoas/MiniPerfilModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaExclamationTriangle,
  FaTrash,
  FaCrown,
  FaDoorOpen,
} from "react-icons/fa";
import { confirm } from "@/components/ui/confirm";
import DenunciaEBloqueioButtons from "@/components/Common/DenunciaEBloqueioButtons";

interface Props {
  participante: UsuarioBuscaDTO;
  viagemId: number;
  usuarioEhCriador: boolean;
  onOpenChat: (participante: UsuarioBuscaDTO) => void;
  unreadCount?: number;
  onDenunciar: (usuario: { id: number; nome: string }) => void;
  onBloquear: (usuario: { id: number; nome: string }) => void;
  podeAvaliar?: boolean;
  onAvaliar?: (participante: UsuarioBuscaDTO) => void;
}

const formatarNome = (nome: string) => {
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0];
  return `${partes[0]} ${partes[partes.length - 1]}`;
};

const ParticipanteCard = ({ 
  participante, 
  viagemId, 
  usuarioEhCriador, 
  onOpenChat, 
  unreadCount,
  onDenunciar,
  onBloquear,
  podeAvaliar,
  onAvaliar
}: Props) => {
  const { usuario } = useAuth();
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const ehCriador = participante.criador;

  const podeRemover =
    usuarioEhCriador &&
    !ehCriador &&
    usuario?.id !== participante.id;

  const podeSair =
    usuario?.id === participante.id && !ehCriador;

  const handleRemover = async () => {
    const ok = await confirm({
      title: "Remover Participante",
      description: `Deseja realmente remover ${formatarNome(participante.nome)} da viagem?`,
      cancelText: "Cancelar",
    });

    if (!ok) return;

    try {
      setCarregando(true);
      await removerParticipanteDaViagem(viagemId, participante.id);
      toast.success("Participante removido com sucesso.");
      window.location.reload();
    } catch (err) {
      toast.error("Erro ao remover participante.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSairDaViagem = async () => {
    const ok = await confirm({
      title: "Sair da Viagem",
      description: `Deseja realmente sair desta viagem?`,
      cancelText: "Cancelar",
    });

    if (!ok) return;

    try {
      setCarregando(true);
      await sairDaViagem(viagemId);
      toast.success("Você saiu da viagem.");
      router.push("/profile?tab=viagens"); // 🔥 Redireciona para perfil na aba Viagens
    } catch (err) {
      toast.error("Erro ao sair da viagem.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <motion.div
        className="group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100/50 shadow-lg hover:shadow-2xl p-6 w-full max-w-xs h-80 transition-all duration-500 ease-out hover:border-primary/20 hover:bg-white/95 cursor-pointer"
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={() => setMostrarModal(true)}
      >
        {/* Status Indicator */}
        {ehCriador && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg z-10"
          >
            <FaCrown className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Avatar Section */}
        <div className="relative mb-4 mx-auto w-20 h-20">
          <div className="w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-primary/30 transition-all duration-300">
            <Image
              src={participante.fotoPerfil || "/img/avatar-placeholder.png"}
              alt={participante.nome}
              width={80}
              height={80}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-5">
          <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary transition-colors duration-300">
            {formatarNome(participante.nome)}
          </h3>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full inline-block">
            {participante.genero} • {participante.idade} anos
          </p>
        </div>

        {/* Action Buttons - Com altura fixa para padronizar */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-center gap-2 flex-wrap min-h-[44px]">
            <motion.button
              title="Ver Perfil"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarModal(true);
              }}
              className="relative w-10 h-10 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all duration-300 group/btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUser className="w-4 h-4" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover/btn:from-blue-500/10 group-hover/btn:to-blue-600/10 transition-all duration-300" />
            </motion.button>

            <motion.button
              title="Enviar Mensagem"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(participante);
              }}
              disabled={usuario?.id === participante.id}
              className="relative w-10 h-10 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl flex items-center justify-center text-purple-600 hover:text-purple-700 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group/btn"
              whileHover={{ scale: usuario?.id === participante.id ? 1 : 1.1 }}
              whileTap={{ scale: usuario?.id === participante.id ? 1 : 0.95 }}
            >
              <MessageCircle className="w-4 h-4" />
              {unreadCount !== undefined && unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg border-2 border-white"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-purple-600/0 group-hover/btn:from-purple-500/10 group-hover/btn:to-purple-600/10 transition-all duration-300" />
            </motion.button>

            {/* Botões de Denúncia e Bloqueio */}
            <div onClick={(e) => e.stopPropagation()}>
              <DenunciaEBloqueioButtons
                usuario={participante}
                onDenunciar={onDenunciar}
                onBloquear={onBloquear}
                size="md"
                layout="horizontal"
              />
            </div>

            {/* Botão de Avaliação */}
            {podeAvaliar && onAvaliar && (
              <motion.button
                title="Avaliar Participante"
                onClick={(e) => {
                  e.stopPropagation();
                  onAvaliar(participante);
                }}
                className="relative w-10 h-10 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl flex items-center justify-center text-yellow-600 hover:text-yellow-700 transition-all duration-300 group/btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-4 h-4" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/0 to-yellow-600/0 group-hover/btn:from-yellow-500/10 group-hover/btn:to-yellow-600/10 transition-all duration-300" />
              </motion.button>
            )}

            {podeRemover && (
              <motion.button
                title="Remover Participante"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemover();
                }}
                disabled={carregando}
                className="relative w-10 h-10 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-300 group/btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {carregando ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <FaTrash className="w-4 h-4" />
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover/btn:from-red-500/10 group-hover/btn:to-red-600/10 transition-all duration-300" />
              </motion.button>
            )}

            {podeSair && (
              <motion.button
                title="Sair da Viagem"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSairDaViagem();
                }}
                disabled={carregando}
                className="relative w-10 h-10 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl flex items-center justify-center text-orange-600 hover:text-orange-700 transition-all duration-300 group/btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {carregando ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <FaDoorOpen className="w-4 h-4" />
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover/btn:from-orange-500/10 group-hover/btn:to-orange-600/10 transition-all duration-300" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 to-orange-500/0 group-hover:from-primary/5 group-hover:to-orange-500/5 transition-all duration-500 pointer-events-none" />
      </motion.div>

      <MiniPerfilModal
        usuario={participante}
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onDenunciar={onDenunciar}
        onBloquear={onBloquear}
      />
    </>
  );
};

export default ParticipanteCard;
