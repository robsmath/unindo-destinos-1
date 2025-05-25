"use client";

import { useEffect, useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { getViagemById } from "@/services/viagemService";
import { getPreferenciaByViagemId } from "@/services/preferenciasService";
import { ViagemDTO } from "@/models/ViagemDTO";
import {
  PreferenciasDTO,
  TipoAcomodacao,
  TipoTransporte,
  EstiloViagem,
} from "@/models/PreferenciasDTO";
import { getImage } from "@/services/googleImageService";
import { Loader2 } from "lucide-react";

interface Props {
  viagemId: number;
  open: boolean;
  onClose: () => void;
  exibirAvisoConvite?: boolean;
}

const emojiTransporte: Record<TipoTransporte, string> = {
  AVIAO: "✈️",
  CARRO: "🚗",
  ONIBUS: "🚌",
  TREM: "🚆",
  NAVIO: "🛳️",
  MOTO: "🏍️",
  BICICLETA: "🚲",
  VAN: "🚐",
  MOTORHOME: "🚍",
  NAO_TENHO_PREFERENCIA: "❓",
};

const emojiAcomodacao: Record<TipoAcomodacao, string> = {
  HOTEL: "🏨",
  HOSTEL: "🛌",
  AIRBNB: "🏠",
  POUSADA: "🏡",
  CAMPING: "🏕️",
  RESORT: "🏖️",
  FAZENDA: "🌾",
  CASA_DE_AMIGOS: "👥",
  NAO_TENHO_PREFERENCIA: "❓",
};

const emojiEstilo: Record<EstiloViagem, string> = {
  AVENTURA: "⛰️",
  CULTURA: "🏛️",
  FESTA: "🎉",
  RELAXAMENTO: "🌴",
  GASTRONOMIA: "🍽️",
  ECOTURISMO: "🌲",
  NEGOCIOS: "💼",
  ROMANTICA: "❤️",
  RELIGIOSA: "⛪",
  COMPRAS: "🛍️",
  PRAIA: "🏖️",
  HISTORICA: "🏰",
  TECNOLOGIA: "💻",
  NAO_TENHO_PREFERENCIA: "❓",
};

export default function ViagemDetalhesModal({
  viagemId,
  open,
  onClose,
  exibirAvisoConvite = false, 
}: Props) {
  const [viagem, setViagem] = useState<ViagemDTO | null>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasDTO | null>(null);
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
      const dadosViagem = await getViagemById(viagemId);
      setViagem(dadosViagem);

      const dadosPreferencias = await getPreferenciaByViagemId(viagemId);
      setPreferencias(dadosPreferencias);

      const img = await getImage(dadosViagem.destino, dadosViagem.categoriaViagem);
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

                    {preferencias && (
                      <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold mb-3">Preferências da Viagem</h3>
                        <div className="flex flex-col gap-2 text-sm text-gray-800">

                          <div className="flex items-center gap-2">
                            {emojiAcomodacao[preferencias.tipoAcomodacao]}{" "}
                            <span>Acomodação em {preferencias.tipoAcomodacao.toLowerCase()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {emojiTransporte[preferencias.tipoTransporte]}{" "}
                            <span>Transporte principal: {preferencias.tipoTransporte.toLowerCase()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {emojiEstilo[preferencias.estiloViagem]}{" "}
                            <span>Estilo de viagem: {preferencias.estiloViagem.toLowerCase()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            👥 <span>
                              {preferencias.generoPreferido === "NAO_TENHO_PREFERENCIA"
                                ? "Sem preferência de gênero"
                                : `Prefere companhia ${preferencias.generoPreferido.toLowerCase()}`}
                            </span>
                          </div>

                          {(preferencias.idadeMinima || preferencias.idadeMaxima) && (
                            <div className="flex items-center gap-2">
                              🎂 <span>
                                Faixa etária entre {preferencias.idadeMinima ?? "qualquer idade"} e {preferencias.idadeMaxima ?? "sem limite"} anos
                              </span>
                            </div>
                          )}

                          {preferencias.valorMedioViagem && (
                            <div className="flex items-center gap-2">
                              💰 <span>Gastos médios estimados em R$ {preferencias.valorMedioViagem.toFixed(2).replace(".", ",")}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {preferencias.petFriendly ? "🐶" : "🚫🐶"} <span>{preferencias.petFriendly ? "Pet Friendly" : "Não aceita pets"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.aceitaCriancas ? "👶" : "🚫👶"} <span>{preferencias.aceitaCriancas ? "Aceita crianças" : "Não aceita crianças"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.aceitaFumantes ? "🚬" : "🚫🚬"} <span>{preferencias.aceitaFumantes ? "Aceita fumantes" : "Não aceita fumantes"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.aceitaBebidasAlcoolicas ? "🍻" : "🚫🍻"} <span>{preferencias.aceitaBebidasAlcoolicas ? "Aceita bebidas alcoólicas" : "Não aceita bebidas"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.acomodacaoCompartilhada ? "🛏️" : "🚫🛏️"}{" "}
                            <span>
                              {preferencias.acomodacaoCompartilhada
                                ? "Acomodação compartilhada"
                                : "Não aceita acomodações compartilhadas"}
                            </span>
                          </div>


                        </div>

                        {exibirAvisoConvite && (
                          <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs">
                            🔒 Para ver mais detalhes dessa viagem, como o roteiro, é necessário aceitar o convite.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

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
