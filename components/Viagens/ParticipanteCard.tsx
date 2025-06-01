"use client";

import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { removerParticipanteDaViagem, sairDaViagem } from "@/services/viagemService";
import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
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

interface Props {
  participante: UsuarioBuscaDTO;
  viagemId: number;
  usuarioEhCriador: boolean;
  onOpenChat: (participante: UsuarioBuscaDTO) => void;
  unreadCount?: number;
}

const formatarNome = (nome: string) => {
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0];
  return `${partes[0]} ${partes[partes.length - 1]}`;
};

const ParticipanteCard = ({ participante, viagemId, usuarioEhCriador, onOpenChat, unreadCount }: Props) => {
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
      <div
        className="bg-white rounded-2xl shadow-md p-5 w-full max-w-xs flex flex-col items-center text-center
        transition-all duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-1"
      >
        <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
          <Image
            src={participante.fotoPerfil || "/img/avatar-placeholder.png"}
            alt={participante.nome}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>

        <h2 className="font-semibold text-lg text-neutral-800 flex items-center gap-2 justify-center">
          {formatarNome(participante.nome)}
          {ehCriador && (
            <FaCrown className="text-yellow-500" title="Criador da Viagem" />
          )}
        </h2>

        <p className="text-sm text-neutral-500 uppercase">
          {participante.genero} • {participante.idade} anos
        </p>

        <div className="flex gap-4 justify-center mt-4 text-xl text-gray-600">
          <button
            title="Ver Perfil"
            onClick={() => setMostrarModal(true)}
            className="hover:text-blue-500 transition"
          >
            <FaUser />
          </button>          <button
            title="Enviar Mensagem"
            onClick={() => onOpenChat(participante)}
            disabled={usuario?.id === participante.id}
            className="hover:text-purple-500 transition relative disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadCount !== undefined && unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </button>

          <button
            title="Denunciar"
            disabled
            className="hover:text-yellow-500 transition"
          >
            <FaExclamationTriangle />
          </button>

          {podeRemover && (
            <button
              title="Remover Participante"
              onClick={handleRemover}
              disabled={carregando}
              className="hover:text-red-500 transition"
            >
              {carregando ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <FaTrash />
              )}
            </button>
          )}

          {podeSair && (
            <button
              title="Sair da Viagem"
              onClick={handleSairDaViagem}
              disabled={carregando}
              className="hover:text-red-500 transition"
            >
              {carregando ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <FaDoorOpen />
              )}
            </button>
          )}
        </div>
      </div>

      <MiniPerfilModal
        usuario={participante}
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
      />
    </>
  );
};

export default ParticipanteCard;
