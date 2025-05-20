"use client";

import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { removerParticipanteDaViagem } from "@/services/viagemService";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import MiniPerfilModal from "@/components/EncontrePessoas/MiniPerfilModal";
import Image from "next/image";
import {
  FaUser,
  FaEnvelope,
  FaExclamationTriangle,
  FaTrash,
  FaCrown,
} from "react-icons/fa";
import { confirm } from "@/components/ui/confirm";

interface Props {
  participante: UsuarioBuscaDTO;
  viagemId: number;
  usuarioEhCriador: boolean;
}

// 🔥 Função para exibir apenas primeiro e último nome
const formatarNome = (nome: string) => {
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0];
  return `${partes[0]} ${partes[partes.length - 1]}`;
};

const ParticipanteCard = ({ participante, viagemId, usuarioEhCriador }: Props) => {
  const { usuario } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const ehCriador = participante.criador;

  const podeRemover =
    usuarioEhCriador && // 🔥 Só o criador da viagem pode remover
    !ehCriador &&       // 🔥 Não pode remover o próprio criador
    usuario?.id !== participante.id; // 🔥 E não pode se remover

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
          </button>

          <button
            title="Enviar Mensagem"
            disabled
            className="hover:text-purple-500 transition"
          >
            <FaEnvelope />
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
              title="Remover"
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
