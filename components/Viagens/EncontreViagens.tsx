"use client";

import { useState, useEffect } from "react";
import { ViagemFiltroDTO } from "@/models/ViagemFiltroDTO";
import { ViagemBuscaDTO } from "@/models/ViagemBuscaDTO";
import { buscarViagens, PageResponse } from "@/services/viagemService";
import SmartImage from "@/components/Common/SmartImage";
import { 
  Loader2, 
  Search, 
  SlidersHorizontal, 
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Plane,
  User,
  RefreshCw,
  Heart,
  Baby,
  Cigarette,
  Wine,
  Bed
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ViagemCardModal from "@/components/Viagens/ViagemCardModal";
import ViagemDetalhesModal from "@/components/Viagens/ViagemDetalhesModal";
import ValueSlider from "@/components/Common/ValueSlider";
import Pagination from "@/components/Common/Pagination";
import { getPreferenciasDoUsuario } from "@/services/preferenciasService";
import { formatarDataViagem, formatarPeriodoViagem } from "@/utils/dateUtils";

function limparFiltros(obj: any) {
  const novo: any = {};
  Object.keys(obj).forEach((k) => {
    if (
      obj[k] !== "" &&
      obj[k] !== null &&
      obj[k] !== undefined
    ) {
      novo[k] = obj[k];
    }
  });
  return novo;
}

const EncontreViagens = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();  const [filtros, setFiltros] = useState<ViagemFiltroDTO>({
    destino: "",
    estiloViagem: undefined,
    categoriaViagem: undefined,
    dataInicio: "",
    dataFim: "",
    valorMedioMax: 0,
    status: undefined,
    generoPreferido: undefined,
    idadeMinima: undefined,
    idadeMaxima: undefined,
    petFriendly: undefined,
    aceitaCriancas: undefined,
    aceitaFumantes: undefined,
    aceitaBebidasAlcoolicas: undefined,
    acomodacaoCompartilhada: undefined,
    tipoAcomodacao: undefined,
    tipoTransporte: undefined,
  });  const [viagens, setViagens] = useState<ViagemBuscaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregandoTela, setCarregandoTela] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(8);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [viagemSelecionada, setViagemSelecionada] = useState<ViagemBuscaDTO | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [viagemDetalhesId, setViagemDetalhesId] = useState<number | null>(null);
  const [idadeMinimaInput, setIdadeMinimaInput] = useState("");
  const [idadeMaximaInput, setIdadeMaximaInput] = useState("");
  const [carregandoPreferencias, setCarregandoPreferencias] = useState(false);useEffect(() => {
    if (isAuthenticated === true) {
      setTimeout(() => setCarregandoTela(false), 300);
    }

    if (isAuthenticated === false) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setIdadeMinimaInput(filtros.idadeMinima?.toString() || "");
    setIdadeMaximaInput(filtros.idadeMaxima?.toString() || "");
  }, [filtros.idadeMinima, filtros.idadeMaxima]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (value === "" ? undefined : value),
    }));
  };

  const atualizarIdade = (campo: "idadeMinima" | "idadeMaxima", valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor === "" ? undefined : parseInt(valor, 10),
    }));
  };
  const handleValorMaximoChange = (valor: number) => {
    setFiltros((prev) => ({
      ...prev,
      valorMedioMax: valor,
    }));
  };
  const buscar = async (page: number = 0) => {
    const idadeMin = filtros.idadeMinima;
    const idadeMax = filtros.idadeMaxima;

    if (idadeMin !== undefined && idadeMax !== undefined && Number(idadeMin) > Number(idadeMax)) {
      toast.warning("A idade mínima não pode ser maior que a idade máxima.");
      return;
    }

    setLoading(true);
    try {
      const filtrosLimpos = limparFiltros({
        ...filtros,
        destino: filtros.destino?.trim() || undefined,
        valorMedioMax: filtros.valorMedioMax === 0 ? undefined : filtros.valorMedioMax,
      });

      const filtrosParaEnviar = Object.keys(filtrosLimpos).length === 0 ? {} : filtrosLimpos;
      
      const res = await buscarViagens(filtrosParaEnviar, page, pageSize);
      
      setViagens(res.content);
      setCurrentPage(res.number);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
      
      if (res.content.length === 0) {
        toast.info("Nenhuma viagem encontrada.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao buscar viagens");
    } finally {
      setLoading(false);
    }
  };  const limparTodosFiltros = () => {    
    setFiltros({
      destino: "",
      estiloViagem: undefined,
      categoriaViagem: undefined,
      dataInicio: "",
      dataFim: "",
      valorMedioMax: 0,
      status: undefined,
      generoPreferido: undefined,
      idadeMinima: undefined,
      idadeMaxima: undefined,
      petFriendly: undefined,
      aceitaCriancas: undefined,
      aceitaFumantes: undefined,
      aceitaBebidasAlcoolicas: undefined,
      acomodacaoCompartilhada: undefined,
      tipoAcomodacao: undefined,
      tipoTransporte: undefined,
    });
    setViagens([]);
    setCurrentPage(0);
    setTotalPages(0);
    setTotalElements(0);
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    buscar(page);
  };

  const formatarNomeCompleto = (nomeCompleto: string) => {
    if (!nomeCompleto) return "Nome não informado";
    const nomes = nomeCompleto.trim().split(" ");
    if (nomes.length === 1) return nomes[0];
    return `${nomes[0]} ${nomes[nomes.length - 1]}`;
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMADA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "EM_ANDAMENTO":
        return "bg-green-100 text-green-800 border-green-200";
      case "CONCLUIDA":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "CANCELADA":
        return "bg-red-100 text-red-800 border-red-200";
      case "RASCUNHO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getEstiloIcon = (estilo: string) => {
    switch (estilo) {
      case "AVENTURA":
        return "🏔️";
      case "CULTURA":
        return "🏛️";
      case "FESTA":
        return "🎉";
      case "RELAXAMENTO":
        return "🏖️";
      case "GASTRONOMIA":
        return "🍽️";
      case "ECOTURISMO":
        return "🌿";
      case "NEGOCIOS":
        return "💼";
      case "ROMANTICA":
        return "💕";
      case "RELIGIOSA":
        return "⛪";
      case "COMPRAS":
        return "🛍️";
      case "PRAIA":
        return "🏝️";
      case "HISTORICA":
        return "🏰";
      case "TECNOLOGIA":
        return "💻";
      case "NAO_TENHO_PREFERENCIA":
        return "✈️";
      default:
        return "✈️";
    }
  };
  const abrirDetalhesViagem = (viagem: ViagemBuscaDTO) => {
    setViagemDetalhesId(viagem.id);
    setModalDetalhesAberto(true);
  };

  const abrirSolicitacaoParticipacao = (viagem: ViagemBuscaDTO) => {
    setViagemSelecionada(viagem);
    setModalAberto(true);
  };

  const importarPreferencias = async () => {
    setCarregandoPreferencias(true);
    try {
      const prefs = await getPreferenciasDoUsuario();
      if (!prefs) {
        toast.info("Nenhuma preferência encontrada para importar.");
        return;
      }

      const tipoAcomodacaoMapeado = (() => {
        const acomodacao = prefs.tipoAcomodacao;
        const compativel = ["HOSTEL", "HOTEL", "AIRBNB", "CAMPING", "NAO_TENHO_PREFERENCIA"];
        return compativel.includes(acomodacao) ? acomodacao as ViagemFiltroDTO["tipoAcomodacao"] : undefined;
      })();

      const tipoTransporteMapeado = (() => {
        const transporte = prefs.tipoTransporte;
        const compativel = ["AVIAO", "CARRO", "TREM", "NAVIO", "NAO_TENHO_PREFERENCIA"];
        if (transporte === "ONIBUS") return "ÔNIBUS" as ViagemFiltroDTO["tipoTransporte"];
        return compativel.includes(transporte) ? transporte as ViagemFiltroDTO["tipoTransporte"] : undefined;
      })();

      setFiltros((prev) => ({
        ...prev,
        generoPreferido: ["MASCULINO", "FEMININO", "OUTRO", "TANTO_FAZ"].includes(prefs.generoPreferido)
          ? (prefs.generoPreferido as ViagemFiltroDTO["generoPreferido"])
          : undefined,
        idadeMinima: typeof prefs.idadeMinima === "number" ? prefs.idadeMinima : undefined,
        idadeMaxima: typeof prefs.idadeMaxima === "number" ? prefs.idadeMaxima : undefined,
        valorMedioMax: typeof prefs.valorMedioViagem === "number" ? prefs.valorMedioViagem : undefined,
        petFriendly: prefs.petFriendly,
        aceitaCriancas: prefs.aceitaCriancas,
        aceitaFumantes: prefs.aceitaFumantes,
        aceitaBebidasAlcoolicas: prefs.aceitaBebidasAlcoolicas,
        acomodacaoCompartilhada: prefs.acomodacaoCompartilhada,
        tipoAcomodacao: tipoAcomodacaoMapeado,
        tipoTransporte: tipoTransporteMapeado,
      }));
      
      toast.success("Preferências importadas com sucesso!");
    } catch (err) {
      console.error("Erro ao buscar preferências do usuário:", err);
      toast.error("Erro ao importar preferências.");
    } finally {
      setCarregandoPreferencias(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (carregandoTela) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-primary/5 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Carregando viagens...</p>
          </div>
        </motion.div>
      </div>
    );
  } 
  const renderCardViagem = (viagem: ViagemBuscaDTO) => (
    <motion.div
      key={viagem.id}
      className="group bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-[620px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div 
        className="relative h-48 overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={() => abrirDetalhesViagem(viagem)}
      >
        <SmartImage
          src={viagem.imagemUrl || "/images/common/beach.jpg"}
          alt={`Viagem para ${viagem.destino}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30 ${getStatusColor(viagem.status)}`}>
            <Clock className="w-3 h-3 mr-1" />
            {viagem.status}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-primary/80 text-white backdrop-blur-sm border border-white/30">
            {viagem.categoriaViagem === "NACIONAL" ? "Nacional" : "Internacional"}
          </span>
        </div>
      </div>      
      
      <div className="p-6 flex flex-col flex-1">   
        <div 
          className="mb-4 cursor-pointer"
          onClick={() => abrirDetalhesViagem(viagem)}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {viagem.destino}
          </h3>
          
          <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
            <span className="text-lg">{getEstiloIcon(viagem.estiloViagem)}</span>
            {viagem.estiloViagem}
          </p>
          <div className="h-[4.5rem] mb-3">
            {viagem.descricao ? (
              <p className="text-sm text-gray-600 line-clamp-3 italic h-full overflow-hidden">
                "{viagem.descricao}"
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic h-full flex items-center">
                O criador ainda não adicionou uma descrição para esta viagem.
              </p>
            )}
          </div>
        </div>

        <div 
          className="space-y-3 flex-1 mb-4 cursor-pointer"
          onClick={() => abrirDetalhesViagem(viagem)}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">
              {formatarPeriodoViagem(viagem.dataInicio, viagem.dataFim)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">
              {viagem.valorMedioViagem ? `R$ ${viagem.valorMedioViagem.toLocaleString("pt-BR")}` : "Valor não informado"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">Criador: {formatarNomeCompleto(viagem.criadorNome)}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {viagem.petFriendly && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                <Heart className="w-3 h-3" />
                Pet Friendly
              </span>
            )}
            {viagem.aceitaCriancas && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                <Baby className="w-3 h-3" />
                Crianças
              </span>
            )}
            {viagem.aceitaFumantes && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                <Cigarette className="w-3 h-3" />
                Fumantes
              </span>
            )}
            {viagem.aceitaBebidasAlcoolicas && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                <Wine className="w-3 h-3" />
                Bebidas
              </span>
            )}
            {viagem.acomodacaoCompartilhada && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                <Bed className="w-3 h-3" />
                Compartilhada
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              {viagem.numeroMaximoParticipantes 
                ? `${viagem.quantidadeParticipantes}/${viagem.numeroMaximoParticipantes} participantes`
                : `${viagem.quantidadeParticipantes} participantes`
              }
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <motion.button
            className="w-full bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              abrirSolicitacaoParticipacao(viagem);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plane className="w-4 h-4" />
            <span className="text-sm sm:text-base">Solicitar Participação</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05))",
              "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05))",
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -90, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.div
          className="absolute top-32 right-16"
          animate={{ 
            y: [0, -18, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Plane className="w-8 h-8 text-blue-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <MapPin className="w-7 h-7 text-gray-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-48 left-40"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 8, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Calendar className="w-6 h-6 text-red-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-24"
          animate={{ 
            y: [0, 12, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <DollarSign className="w-7 h-7 text-yellow-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-64 right-40"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Users className="w-6 h-6 text-green-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-36 right-64"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Search className="w-8 h-8 text-purple-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-48"
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8
          }}
        >
          <Clock className="w-6 h-6 text-indigo-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-72 left-24"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          <SlidersHorizontal className="w-5 h-5 text-teal-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{ y: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-500/15 to-primary/15 rounded-full blur-2xl pointer-events-none"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 mb-4">
              <Plane className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Encontre Viagens</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent mb-4 leading-tight">
              Encontre Viagens Incríveis
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Descubra aventuras únicas e participe de experiências inesquecíveis pelo mundo
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 md:p-6 mb-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Buscar destino:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Digite o destino, cidade, país..."
                    value={filtros.destino}
                    onChange={e => setFiltros(prev => ({ ...prev, destino: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        buscar(0);
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => buscar(0)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-lg hover:scale-105 shadow-md transition-all duration-200 font-medium flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Buscar Viagens
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtros Avançados</span>
                  <span className="sm:hidden">Filtros</span>
                </button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {mostrarFiltros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 md:p-6 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-800">Filtros Avançados</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Gênero Preferido</label>
                    <select
                      name="generoPreferido"
                      value={filtros.generoPreferido || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Qualquer</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="OUTRO">Outro</option>
                      <option value="TANTO_FAZ">Tanto Faz</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Tipo de Acomodação</label>
                    <select
                      name="tipoAcomodacao"
                      value={filtros.tipoAcomodacao || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Não tenho preferência</option>
                      <option value="HOTEL">Hotel</option>
                      <option value="HOSTEL">Hostel</option>
                      <option value="AIRBNB">Airbnb</option>
                      <option value="CAMPING">Camping</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Tipo de Transporte</label>
                    <select
                      name="tipoTransporte"
                      value={filtros.tipoTransporte || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Não tenho preferência</option>
                      <option value="AVIAO">Avião</option>
                      <option value="CARRO">Carro</option>
                      <option value="ÔNIBUS">Ônibus</option>
                      <option value="TREM">Trem</option>
                      <option value="NAVIO">Navio</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Tipo do destino</label>
                    <select
                      name="categoriaViagem"
                      value={filtros.categoriaViagem || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="NACIONAL">Nacional</option>
                      <option value="INTERNACIONAL">Internacional</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Estilo</label>
                    <select
                      name="estiloViagem"
                      value={filtros.estiloViagem || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Todos os estilos</option>
                      <option value="AVENTURA">🏔️ Aventura</option>
                      <option value="CULTURA">🏛️ Cultura</option>
                      <option value="FESTA">🎉 Festa</option>
                      <option value="RELAXAMENTO">🏖️ Relaxamento</option>
                      <option value="GASTRONOMIA">🍽️ Gastronomia</option>
                      <option value="ECOTURISMO">🌿 Ecoturismo</option>
                      <option value="NEGOCIOS">💼 Negócios</option>
                      <option value="ROMANTICA">💕 Romântica</option>
                      <option value="RELIGIOSA">⛪ Religiosa</option>
                      <option value="COMPRAS">🛍️ Compras</option>
                      <option value="PRAIA">🏝️ Praia</option>
                      <option value="HISTORICA">🏰 Histórica</option>
                      <option value="TECNOLOGIA">💻 Tecnologia</option>
                      <option value="NAO_TENHO_PREFERENCIA">✈️ Sem Preferência</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
                    <select
                      name="status"
                      value={filtros.status || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Todos os status</option>
                      <option value="PENDENTE">🟡 Pendente</option>
                      <option value="CONFIRMADA">🔵 Confirmada</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Idade Mínima</label>
                    <input
                      type="text"
                      name="idadeMinima"
                      inputMode="numeric"
                      value={idadeMinimaInput}
                      onChange={(e) => setIdadeMinimaInput(e.target.value)}
                      onBlur={() => {
                        const min = parseInt(idadeMinimaInput || "0", 10);
                        const max = filtros.idadeMaxima || 0;

                        if (min < 18) {
                          toast.warning("A idade mínima não pode ser menor que 18.");
                          setIdadeMinimaInput("18");
                          atualizarIdade("idadeMinima", "18");
                        } else if (max && min > max) {
                          toast.warning("A idade mínima não pode ser maior que a idade máxima.");
                          setIdadeMinimaInput(max.toString());
                          atualizarIdade("idadeMinima", max.toString());
                        } else {
                          atualizarIdade("idadeMinima", min === 0 ? "" : min.toString());
                        }
                      }}
                      placeholder="18"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Idade Máxima</label>
                    <input
                      type="text"
                      name="idadeMaxima"
                      inputMode="numeric"
                      value={idadeMaximaInput}
                      onChange={(e) => setIdadeMaximaInput(e.target.value)}
                      onBlur={() => {
                        const max = parseInt(idadeMaximaInput || "0", 10);
                        const min = filtros.idadeMinima || 0;

                        if (max < 18) {
                          toast.warning("A idade máxima não pode ser menor que 18.");
                          setIdadeMaximaInput("18");
                          atualizarIdade("idadeMaxima", "18");
                        } else if (min && max < min) {
                          toast.warning("A idade máxima não pode ser menor que a idade mínima.");
                          setIdadeMaximaInput(min.toString());
                          atualizarIdade("idadeMaxima", min.toString());
                        } else {
                          atualizarIdade("idadeMaxima", max === 0 ? "" : max.toString());
                        }
                      }}
                      placeholder="60"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <ValueSlider
                      value={filtros.valorMedioMax || 0}
                      onChange={handleValorMaximoChange}
                      min={0}
                      max={20000}
                      step={100}
                      label="Valor máximo por pessoa"
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Data Inicial (de)</label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={filtros.dataInicio}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Data Inicial (até)</label>
                    <input
                      type="date"
                      name="dataFim"
                      value={filtros.dataFim}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 block mb-3">Preferências de Viagem</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                      { nome: "petFriendly", label: "Pet Friendly", icon: Heart },
                      { nome: "aceitaCriancas", label: "Aceita Crianças", icon: Baby },
                      { nome: "aceitaFumantes", label: "Aceita Fumantes", icon: Cigarette },
                      { nome: "aceitaBebidasAlcoolicas", label: "Aceita Bebidas", icon: Wine },
                      { nome: "acomodacaoCompartilhada", label: "Acomodação Compartilhada", icon: Bed },
                    ].map(({ nome, label, icon: Icon }) => (
                      <label key={nome} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          name={nome}
                          checked={!!filtros[nome as keyof ViagemFiltroDTO]}
                          onChange={handleChange}
                          className="accent-primary rounded"
                        />
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={importarPreferencias}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex-1"
                    disabled={carregandoPreferencias}
                  >
                    {carregandoPreferencias ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Importar Preferências
                      </>
                    )}
                  </button>

                  <button
                    onClick={limparTodosFiltros}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors duration-200 font-medium flex-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Limpar Filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            {loading ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">Buscando viagens...</p>
                </div>
              </motion.div>
            ) : viagens.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma viagem encontrada</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros destinos.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
              >
                {viagens.map((viagem) => (
                  <motion.div
                    key={viagem.id}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(234,88,12,0.10)" }}
                    className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col justify-between min-h-[520px] cursor-pointer border border-primary/10"
                    onClick={(e) => {
                      const clicouNoBotao = (e.target as HTMLElement).closest("button");
                      if (!clicouNoBotao) {
                        abrirDetalhesViagem(viagem);
                      }
                    }}
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden rounded-xl mb-4">
                        <SmartImage
                          src={viagem.imagemUrl || "/images/common/beach.jpg"}
                          alt={`Viagem para ${viagem.destino}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30 ${getStatusColor(viagem.status)}`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {viagem.status}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-primary/80 text-white backdrop-blur-sm border border-white/30">
                            {viagem.categoriaViagem === "NACIONAL" ? "Nacional" : "Internacional"}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {viagem.destino}
                      </h3>
                      
                      <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                        <span className="text-lg">{getEstiloIcon(viagem.estiloViagem)}</span>
                        {viagem.estiloViagem}
                      </p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="truncate">
                            {formatarPeriodoViagem(viagem.dataInicio, viagem.dataFim)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="truncate">
                            {viagem.valorMedioViagem ? `R$ ${viagem.valorMedioViagem.toLocaleString("pt-BR")}` : "Valor não informado"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="truncate">Criador: {formatarNomeCompleto(viagem.criadorNome)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>
                            {viagem.numeroMaximoParticipantes 
                              ? `${viagem.quantidadeParticipantes}/${viagem.numeroMaximoParticipantes} participantes`
                              : `${viagem.quantidadeParticipantes} participantes`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Preferências da viagem */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {viagem.petFriendly && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                            <Heart className="w-3 h-3" />
                            Pet Friendly
                          </span>
                        )}
                        {viagem.aceitaCriancas && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            <Baby className="w-3 h-3" />
                            Crianças
                          </span>
                        )}
                        {viagem.aceitaFumantes && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            <Cigarette className="w-3 h-3" />
                            Fumantes
                          </span>
                        )}
                        {viagem.aceitaBebidasAlcoolicas && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                            <Wine className="w-3 h-3" />
                            Bebidas
                          </span>
                        )}
                        {viagem.acomodacaoCompartilhada && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                            <Bed className="w-3 h-3" />
                            Compartilhada
                          </span>
                        )}
                      </div>

                      {viagem.descricao && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 line-clamp-2 italic">
                            "{viagem.descricao}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <motion.button
                        className="w-full bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirSolicitacaoParticipacao(viagem);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plane className="w-4 h-4" />
                        <span className="text-sm sm:text-base">Solicitar Participação</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Paginação */}
            {!loading && viagens.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                size={pageSize}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      <ViagemCardModal
        viagem={viagemSelecionada}
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setViagemSelecionada(null);
        }}
      />

      {viagemDetalhesId && (
        <ViagemDetalhesModal
          viagemId={viagemDetalhesId}
          open={modalDetalhesAberto}
          onClose={() => {
            setModalDetalhesAberto(false);
            setViagemDetalhesId(null);
          }}
          imagemViagem={viagemDetalhesId ? viagens.find(v => v.id === viagemDetalhesId)?.imagemUrl : undefined}
        />
      )}
    </div>
  );
};

export default EncontreViagens;
