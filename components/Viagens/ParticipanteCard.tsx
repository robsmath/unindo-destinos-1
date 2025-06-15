"use client";

import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { MessageCircle, Star } from "lucide-react";
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
import DenunciaEBloqueioButtons from "@/components/Common/DenunciaEBloqueioButtons";
import SairViagemModal from "@/components/Modals/SairViagemModal";
import RemoverParticipanteModal from "@/components/Modals/RemoverParticipanteModal";

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
  viagemDestino?: string;
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
  onAvaliar,
  viagemDestino
}: Props) => {
  const { usuario } = useAuth();
  const router = useRouter();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sairViagemModal, setSairViagemModal] = useState(false);
  const [removerParticipanteModal, setRemoverParticipanteModal] = useState(false);

  const ehCriador = participante.criador;

  const podeRemover =
    usuarioEhCriador &&
    !ehCriador &&
    usuario?.id !== participante.id;

  const podeSair =
    usuario?.id === participante.id && !ehCriador;

  const handleAbrirModalRemover = () => {
    setRemoverParticipanteModal(true);
  };

  const handleAbrirModalSair = () => {
    setSairViagemModal(true);
  };

  const handleRemocaoConfirmada = () => {
    window.location.reload();
  };

  const handleSaidaConfirmada = () => {
    router.push("/profile?tab=viagens");
  };

  return (
    <>
      <motion.div
        className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100/60 shadow-md hover:shadow-xl p-4 w-full max-w-xs h-60 sm:h-64 transition-all duration-300 ease-out hover:border-primary/30 hover:bg-white cursor-pointer overflow-hidden"
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={() => setMostrarModal(true)}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)'
        }}
      >
        {ehCriador && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
            className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg z-10 ring-2 ring-white"
          >
            <FaCrown className="w-3 h-3 text-white" />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-orange-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <div className="relative mb-3 mx-auto w-14 h-14 sm:w-16 sm:h-16">
          <div className="w-full h-full rounded-xl overflow-hidden ring-2 ring-white shadow-md group-hover:ring-primary/20 transition-all duration-300">
            <Image
              src={participante.fotoPerfil || "/img/avatar-placeholder.png"}
              alt={participante.nome}
              width={64}
              height={64}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        <div className="text-center mb-3">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1 leading-tight">
            {formatarNome(participante.nome)}
          </h3>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50/80 px-2 py-0.5 rounded-full inline-block">
            {participante.genero} • {participante.idade}
          </p>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-center gap-1 flex-wrap min-h-[32px]">
            <motion.button
              title="Ver Perfil"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarModal(true);
              }}
              className="relative w-8 h-8 bg-blue-50/80 hover:bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 transition-all duration-200 group/btn border border-blue-100/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUser className="w-3 h-3" />
            </motion.button>

            <motion.button
              title="Enviar Mensagem"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(participante);
              }}
              disabled={usuario?.id === participante.id}
              className="relative w-8 h-8 bg-purple-50/80 hover:bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group/btn border border-purple-100/50"
              whileHover={{ scale: usuario?.id === participante.id ? 1 : 1.1 }}
              whileTap={{ scale: usuario?.id === participante.id ? 1 : 0.95 }}
            >
              <MessageCircle className="w-3 h-3" />
              {unreadCount !== undefined && unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[14px] h-[14px] flex items-center justify-center font-bold shadow-sm border border-white"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex gap-0.5"
            >
              <DenunciaEBloqueioButtons
                usuario={participante}
                onDenunciar={onDenunciar}
                onBloquear={onBloquear}
                size="sm"
                layout="horizontal"
              />
            </div>

            {podeAvaliar && onAvaliar && (
              <motion.button
                title="Avaliar Participante"
                onClick={(e) => {
                  e.stopPropagation();
                  onAvaliar(participante);
                }}
                className="relative w-8 h-8 bg-yellow-50/80 hover:bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 transition-all duration-200 group/btn border border-yellow-100/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-3 h-3" />
              </motion.button>
            )}

            {podeRemover && (
              <motion.button
                title="Remover Participante"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAbrirModalRemover();
                }}
                className="relative w-8 h-8 bg-red-50/80 hover:bg-red-100 rounded-lg flex items-center justify-center text-red-600 transition-all duration-200 group/btn border border-red-100/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash className="w-3 h-3" />
              </motion.button>
            )}

            {podeSair && (
              <motion.button
                title="Sair da Viagem"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAbrirModalSair();
                }}
                className="relative w-8 h-8 bg-orange-50/80 hover:bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 transition-all duration-200 group/btn border border-orange-100/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDoorOpen className="w-3 h-3" />
              </motion.button>
            )}
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 to-orange-500/0 group-hover:from-primary/3 group-hover:to-orange-500/3 transition-all duration-500 pointer-events-none" />
      </motion.div>

      <MiniPerfilModal
        usuario={participante}
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onDenunciar={onDenunciar}
        onBloquear={onBloquear}
      />

      {sairViagemModal && (
        <SairViagemModal
          isOpen={sairViagemModal}
          onClose={() => setSairViagemModal(false)}
          viagemId={viagemId}
          viagemDestino={viagemDestino || "Esta viagem"}
          onSaidaConfirmada={handleSaidaConfirmada}
        />
      )}

      {removerParticipanteModal && (
        <RemoverParticipanteModal
          isOpen={removerParticipanteModal}
          onClose={() => setRemoverParticipanteModal(false)}
          viagemId={viagemId}
          participanteId={participante.id}
          participanteNome={participante.nome}
          onRemocaoConfirmada={handleRemocaoConfirmada}
        />
      )}
    </>
  );
};

export default ParticipanteCard;
