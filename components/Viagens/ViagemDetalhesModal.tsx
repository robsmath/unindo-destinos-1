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
import { 
  Loader2, 
  X,
  Plane,
  Car,
  Bus,
  Train,
  Ship,
  Bike,
  HelpCircle,
  Hotel,
  Bed,
  Home,
  TreePine,
  UtensilsCrossed,
  Banknote,
  Users,
  Calendar,
  Baby,
  Cigarette,
  Wine,
  Ban,
  Heart,
  Mountain,
  Building,
  PartyPopper,
  Palmtree,
  Church,
  ShoppingBag,
  Waves,
  Castle,
  Laptop,
  Briefcase,
  Dog
} from "lucide-react";

interface Props {
  viagemId: number;
  open: boolean;
  onClose: () => void;
  exibirAvisoConvite?: boolean;
  imagemViagem?: string;
}

const iconeTransporte: Record<TipoTransporte, React.ReactElement> = {
  AVIAO: <Plane className="w-4 h-4" />,
  CARRO: <Car className="w-4 h-4" />,
  ONIBUS: <Bus className="w-4 h-4" />,
  TREM: <Train className="w-4 h-4" />,
  NAVIO: <Ship className="w-4 h-4" />,
  MOTO: <Car className="w-4 h-4" />,
  BICICLETA: <Bike className="w-4 h-4" />,
  VAN: <Car className="w-4 h-4" />,
  MOTORHOME: <Car className="w-4 h-4" />,
  NAO_TENHO_PREFERENCIA: <HelpCircle className="w-4 h-4" />,
};

const iconeAcomodacao: Record<TipoAcomodacao, React.ReactElement> = {
  HOTEL: <Hotel className="w-4 h-4" />,
  HOSTEL: <Bed className="w-4 h-4" />,
  AIRBNB: <Home className="w-4 h-4" />,
  POUSADA: <Home className="w-4 h-4" />,
  CAMPING: <TreePine className="w-4 h-4" />,
  RESORT: <Hotel className="w-4 h-4" />,
  FAZENDA: <TreePine className="w-4 h-4" />,
  CASA_DE_AMIGOS: <Users className="w-4 h-4" />,
  NAO_TENHO_PREFERENCIA: <HelpCircle className="w-4 h-4" />,
};

const iconeEstilo: Record<EstiloViagem, React.ReactElement> = {
  AVENTURA: <Mountain className="w-4 h-4" />,
  CULTURA: <Building className="w-4 h-4" />,
  FESTA: <PartyPopper className="w-4 h-4" />,
  RELAXAMENTO: <Palmtree className="w-4 h-4" />,
  GASTRONOMIA: <UtensilsCrossed className="w-4 h-4" />,
  ECOTURISMO: <TreePine className="w-4 h-4" />,
  NEGOCIOS: <Briefcase className="w-4 h-4" />,
  ROMANTICA: <Heart className="w-4 h-4" />,
  RELIGIOSA: <Church className="w-4 h-4" />,
  COMPRAS: <ShoppingBag className="w-4 h-4" />,
  PRAIA: <Waves className="w-4 h-4" />,
  HISTORICA: <Castle className="w-4 h-4" />,
  TECNOLOGIA: <Laptop className="w-4 h-4" />,
  NAO_TENHO_PREFERENCIA: <HelpCircle className="w-4 h-4" />,
};

export default function ViagemDetalhesModal({
  viagemId,
  open,
  onClose,
  exibirAvisoConvite = false,
  imagemViagem,
}: Props) {  const [viagem, setViagem] = useState<ViagemDTO | null>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasDTO | null>(null);
  const [imagem, setImagem] = useState<string>("");
  const [carregando, setCarregando] = useState(false);
  const [imagemCarregando, setImagemCarregando] = useState(false);
  useEffect(() => {
    if (open) {
      carregarDados();
    } else {
      setViagem(null);
      setPreferencias(null);
      setImagem("");
      setImagemCarregando(false);
    }
  }, [open]);

  useEffect(() => {
    if (imagemViagem) {
      setImagem(imagemViagem);
      setImagemCarregando(false);
    }
  }, [imagemViagem]);  const carregarDados = async () => {
    setCarregando(true);
    try {
      const dadosViagem = await getViagemById(viagemId);
      setViagem(dadosViagem);

      const dadosPreferencias = await getPreferenciaByViagemId(viagemId);
      setPreferencias(dadosPreferencias);

      if (!imagemViagem) {
        setImagem("/images/common/beach.jpg");
        setImagemCarregando(false);
      }
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
                  <>                    <div className="relative">
                      {imagemCarregando && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
                          <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <img
                        src={imagem || "/images/common/beach.jpg"}
                        alt={viagem.destino}
                        className="w-full h-48 object-cover rounded-xl mb-4 border"
                        onLoad={() => setImagemCarregando(false)}
                        onError={() => {
                          setImagemCarregando(false);
                          setImagem("/images/common/beach.jpg");
                        }}
                        style={{ display: imagemCarregando ? 'none' : 'block' }}
                      />
                    </div>

                    <h2 className="text-xl font-bold mb-1 text-center">{viagem.destino}</h2>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      {new Date(viagem.dataInicio).toLocaleDateString()} até{" "}
                      {new Date(viagem.dataFim).toLocaleDateString()}
                    </p>

                    <div className="text-sm text-gray-800 space-y-1">
                      <p><strong>Status:</strong> {viagem.status}</p>
                      <p><strong>Estilo:</strong> {viagem.estilo}</p>
                      <p><strong>Tipo:</strong> {viagem.categoriaViagem === "INTERNACIONAL" ? "Internacional" : "Nacional"}</p>
                    </div>                    <div className="mt-4 border-t pt-4">
                      <h3 className="font-semibold mb-3">Preferências da Viagem</h3>
                      {preferencias ? (
                        <div className="flex flex-col gap-2 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            {iconeAcomodacao[preferencias.tipoAcomodacao]}{" "}
                            <span>Acomodação em {preferencias.tipoAcomodacao.toLowerCase()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {iconeTransporte[preferencias.tipoTransporte]}{" "}
                            <span>Transporte principal: {preferencias.tipoTransporte.toLowerCase()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {iconeEstilo[preferencias.estiloViagem]}{" "}
                            <span>Estilo de viagem: {preferencias.estiloViagem.toLowerCase()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" /> <span>
                              {preferencias.generoPreferido === "NAO_TENHO_PREFERENCIA"
                                ? "Sem preferência de gênero"
                                : `Prefere companhia ${preferencias.generoPreferido.toLowerCase()}`}
                            </span>
                          </div>

                          {(preferencias.idadeMinima || preferencias.idadeMaxima) && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> <span>
                                Faixa etária entre {preferencias.idadeMinima ?? "qualquer idade"} e {preferencias.idadeMaxima ?? "sem limite"} anos
                              </span>
                            </div>
                          )}

                          {preferencias.valorMedioViagem && (
                            <div className="flex items-center gap-2">
                              <Banknote className="w-4 h-4" /> <span>Gastos médios estimados em R$ {preferencias.valorMedioViagem.toFixed(2).replace(".", ",")}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {preferencias.petFriendly ? <Dog className="w-4 h-4" /> : <Ban className="w-4 h-4" />} <span>{preferencias.petFriendly ? "Pet Friendly" : "Não aceita pets"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.aceitaCriancas ? <Baby className="w-4 h-4" /> : <Ban className="w-4 h-4" />} <span>{preferencias.aceitaCriancas ? "Aceita crianças" : "Não aceita crianças"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.aceitaFumantes ? <Cigarette className="w-4 h-4" /> : <Ban className="w-4 h-4" />} <span>{preferencias.aceitaFumantes ? "Aceita fumantes" : "Não aceita fumantes"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.aceitaBebidasAlcoolicas ? <Wine className="w-4 h-4" /> : <Ban className="w-4 h-4" />} <span>{preferencias.aceitaBebidasAlcoolicas ? "Aceita bebidas alcoólicas" : "Não aceita bebidas"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {preferencias.acomodacaoCompartilhada ? <Bed className="w-4 h-4" /> : <Ban className="w-4 h-4" />}{" "}
                            <span>
                              {preferencias.acomodacaoCompartilhada
                                ? "Acomodação compartilhada"
                                : "Não aceita acomodações compartilhadas"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                          <HelpCircle className="w-8 h-8 mb-2" />
                          <p className="text-sm text-center">Nenhuma preferência de viagem foi definida para esta viagem.</p>
                        </div>
                      )}

                      {exibirAvisoConvite && (
                        <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs flex items-center gap-2">
                          <Ban className="w-4 h-4" /> Para ver mais detalhes dessa viagem, como o roteiro, é necessário aceitar o convite.
                        </div>
                      )}
                    </div>
                  </>
                )}                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
