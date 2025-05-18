"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ViagemDTO } from "@/models/ViagemDTO";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { enviarConvite } from "@/services/solicitacaoService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuario: UsuarioBuscaDTO;
  viagens: ViagemDTO[];
}

const formatarData = (dataISO: string) => {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR");
};

export default function ConviteViagemModal({
  isOpen,
  onClose,
  usuario,
  viagens,
}: Props) {
  const [viagemSelecionadaId, setViagemSelecionadaId] = useState<string>("");
  const [carregando, setCarregando] = useState(false);

  const handleEnviarConvite = async () => {
    if (!viagemSelecionadaId) {
      toast.warning("Selecione uma viagem antes de enviar o convite.");
      return;
    }

    try {
      setCarregando(true);
      await enviarConvite(Number(viagemSelecionadaId), usuario.id);
      toast.success("Convite enviado com sucesso!");
      onClose();
    } catch (err) {
      toast.error("Erro ao enviar convite. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-2"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={usuario.fotoPerfil || "/images/user/avatar.png"}
                    alt="Foto do usuário"
                    className="w-20 h-20 rounded-full object-cover border mb-4"
                  />
                  <h2 className="text-xl font-bold mb-2">
                    Convidar {usuario.nome} para qual viagem?
                  </h2>
                </div>

                <select
                  value={viagemSelecionadaId}
                  onChange={(e) => setViagemSelecionadaId(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full mb-4 mt-2"
                >
                  <option value="">Selecione uma viagem</option>
                  {viagens.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.destino} (de {formatarData(v.dataInicio)} até {formatarData(v.dataFim)})
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
                    disabled={carregando}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEnviarConvite}
                    disabled={carregando}
                    className={`px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold flex items-center justify-center gap-2 ${
                      carregando ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {carregando ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Convite"
                    )}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
