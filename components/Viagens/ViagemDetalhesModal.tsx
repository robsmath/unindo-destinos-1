"use client";

import { useEffect, useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { getViagemById } from "@/services/viagemService";
import { ViagemDTO } from "@/models/ViagemDTO";
import { getImage } from "@/services/googleImageService";
import { Loader2 } from "lucide-react";

interface Props {
  viagemId: number;
  open: boolean;
  onClose: () => void;
}

export default function ViagemDetalhesModal({ viagemId, open, onClose }: Props) {
  const [viagem, setViagem] = useState<ViagemDTO | null>(null);
  const [imagem, setImagem] = useState<string>("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (open) {
      carregarDados();
    }
  }, [open]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const dados = await getViagemById(viagemId);
      setViagem(dados);

      const img = await getImage(dados.destino, dados.categoriaViagem);
      setImagem(img || "");
    } catch (err) {
      console.error("Erro ao carregar detalhes da viagem", err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
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
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                {/* Conteúdo com loading */}
                {carregando || !viagem ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Loader2 className="animate-spin w-6 h-6 mb-2" />
                    Carregando detalhes da viagem...
                  </div>
                ) : (
                  <>
                    <img
                      src={imagem || "/images/common/beach.jpg"}
                      alt={viagem.destino}
                      className="w-full h-48 object-cover rounded-xl mb-4 border"
                    />

                    <h2 className="text-xl font-bold mb-1 text-center">{viagem.destino}</h2>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      {new Date(viagem.dataInicio).toLocaleDateString()} até{" "}
                      {new Date(viagem.dataFim).toLocaleDateString()}
                    </p>

                    <div className="text-sm text-gray-800 space-y-1">
                      <p><strong>Status:</strong> {viagem.status}</p>
                      <p><strong>Estilo:</strong> {viagem.estilo}</p>
                      <p><strong>Tipo:</strong> {viagem.categoriaViagem === "INTERNACIONAL" ? "Internacional" : "Nacional"}</p>
                    </div>
                  </>
                )}

                {/* Botão fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
