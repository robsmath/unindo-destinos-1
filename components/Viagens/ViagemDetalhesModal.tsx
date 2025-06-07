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
import { getParticipantesDaViagem } from "@/services/viagemService";
import { ViagemDTO } from "@/models/ViagemDTO";
import {
  PreferenciasDTO,
  TipoAcomodacao,
  TipoTransporte,
  EstiloViagem,
} from "@/models/PreferenciasDTO";
import SmartImage from "@/components/Common/SmartImage";
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
  Dog,
  Settings,
  FileText
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
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [imagem, setImagem] = useState<string>("");
  const [carregando, setCarregando] = useState(false);useEffect(() => {
    if (open) {
      carregarDados();    } else {
      setViagem(null);
      setPreferencias(null);
      setParticipantes([]);
      setImagem("");
    }
  }, [open]);

  useEffect(() => {
    if (imagemViagem) {
      setImagem(imagemViagem);
    }
  }, [imagemViagem]);const carregarDados = async () => {
    setCarregando(true);
    try {
      const dadosViagem = await getViagemById(viagemId);
      setViagem(dadosViagem);

      const dadosPreferencias = await getPreferenciaByViagemId(viagemId);
      setPreferencias(dadosPreferencias);

      // Carregar participantes para contar
      const dadosParticipantes = await getParticipantesDaViagem(viagemId);
      setParticipantes(dadosParticipantes);

      if (!imagemViagem) {
        // Usar a imagem da viagem carregada ou a imagem padrão
        setImagem(dadosViagem.imagemUrl || "/images/common/beach.jpg");
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
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl transition-all">
                {carregando || !viagem ? (
                  <div className="flex flex-col items-center justify-center py-16 px-8 text-gray-500">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center">
                        <Loader2 className="animate-spin w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">Carregando detalhes da viagem...</p>
                  </div>
                ) : (
                  <>                    {/* Header com Imagem */}
                    <div className="relative h-64 overflow-hidden rounded-t-3xl">                      <SmartImage
                        src={imagem || "/images/common/beach.jpg"}
                        alt={viagem.destino}
                        className="w-full h-full object-cover"
                        fallbackSrc="/images/common/beach.jpg"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Título sobreposto */}
                      <div className="absolute bottom-6 left-6 right-16 text-white">
                        <h2 className="text-2xl font-bold mb-2">{viagem.destino}</h2>
                        <div className="flex items-center gap-2 text-white/90">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(viagem.dataInicio).toLocaleDateString()} até{" "}
                            {new Date(viagem.dataFim).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="p-8">
                      {/* Status e Informações Básicas */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          viagem.status === "CONFIRMADA"
                            ? "bg-green-100 text-green-700"
                            : viagem.status === "EM_ANDAMENTO"
                            ? "bg-blue-100 text-blue-700"
                            : viagem.status === "CONCLUIDA"
                            ? "bg-gray-100 text-gray-700"
                            : viagem.status === "CANCELADA"
                            ? "bg-red-100 text-red-700"
                            : viagem.status === "PENDENTE"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {viagem.status.replace('_', ' ')}
                        </span>
                        
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {viagem.estilo}
                        </span>
                        
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                          {viagem.categoriaViagem === "INTERNACIONAL" ? "Internacional" : "Nacional"}
                        </span>                      </div>

                      {/* Informações da Viagem */}
                      <div className="space-y-4 mb-6">
                        {viagem.descricao && (
                          <div className="space-y-3">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                              <FileText className="w-5 h-5 text-primary" />
                              Descrição
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {viagem.descricao}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                              <span className="text-sm font-medium text-gray-700">Participantes</span>
                              <p className="text-lg font-semibold text-gray-800">
                                {participantes.length} de {viagem.numeroMaximoParticipantes || "∞"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Seção de Preferências */}
                      <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                          <Settings className="w-5 h-5 text-primary" />
                          Preferências da Viagem
                        </h3>
                        
                        {preferencias ? (
                          <div className="space-y-4">
                            {/* Grid de Preferências Principais */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  {iconeAcomodacao[preferencias.tipoAcomodacao]}
                                  <span className="text-sm font-medium text-gray-700">Acomodação</span>
                                </div>
                                <p className="text-xs text-gray-600 capitalize">
                                  {preferencias.tipoAcomodacao.toLowerCase().replace('_', ' ')}
                                </p>
                              </div>

                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  {iconeTransporte[preferencias.tipoTransporte]}
                                  <span className="text-sm font-medium text-gray-700">Transporte</span>
                                </div>
                                <p className="text-xs text-gray-600 capitalize">
                                  {preferencias.tipoTransporte.toLowerCase().replace('_', ' ')}
                                </p>
                              </div>

                              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  {iconeEstilo[preferencias.estiloViagem]}
                                  <span className="text-sm font-medium text-gray-700">Estilo</span>
                                </div>
                                <p className="text-xs text-gray-600 capitalize">
                                  {preferencias.estiloViagem.toLowerCase().replace('_', ' ')}
                                </p>
                              </div>

                              {preferencias.valorMedioViagem && (
                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Banknote className="w-4 h-4 text-yellow-600" />
                                    <span className="text-sm font-medium text-gray-700">Orçamento</span>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    R$ {preferencias.valorMedioViagem.toFixed(2).replace(".", ",")}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Preferências Secundárias */}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Preferências Gerais</h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">
                                    {preferencias.generoPreferido === "NAO_TENHO_PREFERENCIA"
                                      ? "Sem preferência"
                                      : preferencias.generoPreferido.toLowerCase()}
                                  </span>
                                </div>

                                {(preferencias.idadeMinima || preferencias.idadeMaxima) && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">
                                      {preferencias.idadeMinima ?? "18"}-{preferencias.idadeMaxima ?? "60"} anos
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  {preferencias.petFriendly ? <Dog className="w-4 h-4 text-green-500" /> : <Ban className="w-4 h-4 text-red-500" />}
                                  <span className="text-gray-600">
                                    {preferencias.petFriendly ? "Pet Friendly" : "Sem pets"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {preferencias.aceitaCriancas ? <Baby className="w-4 h-4 text-green-500" /> : <Ban className="w-4 h-4 text-red-500" />}
                                  <span className="text-gray-600">
                                    {preferencias.aceitaCriancas ? "Com crianças" : "Sem crianças"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {preferencias.aceitaFumantes ? <Cigarette className="w-4 h-4 text-orange-500" /> : <Ban className="w-4 h-4 text-red-500" />}
                                  <span className="text-gray-600">
                                    {preferencias.aceitaFumantes ? "Permite fumar" : "Não fumante"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {preferencias.aceitaBebidasAlcoolicas ? <Wine className="w-4 h-4 text-purple-500" /> : <Ban className="w-4 h-4 text-red-500" />}
                                  <span className="text-gray-600">
                                    {preferencias.aceitaBebidasAlcoolicas ? "Com bebidas" : "Sem álcool"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Aviso sobre acomodação compartilhada */}
                            {preferencias.acomodacaoCompartilhada && (
                              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-blue-700">
                                  <Bed className="w-4 h-4" />
                                  <span className="text-sm font-medium">Acomodação Compartilhada</span>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                  Esta viagem permite acomodações compartilhadas entre participantes.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <HelpCircle className="w-12 h-12 mb-3" />
                            <p className="text-sm text-center">Nenhuma preferência definida para esta viagem.</p>
                          </div>
                        )}

                        {/* Aviso sobre convite */}
                        {exibirAvisoConvite && (
                          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                            <div className="flex items-start gap-3">
                              <Ban className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-amber-800 mb-1">Acesso Limitado</h4>
                                <p className="text-xs text-amber-700">
                                  Para ver mais detalhes como roteiro e participantes, é necessário aceitar o convite desta viagem.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Botão de Fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
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
