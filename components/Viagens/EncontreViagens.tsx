"use client";

import { useState, useEffect } from "react";
import { ViagemFiltroDTO } from "@/models/ViagemFiltroDTO";
import { ViagemBuscaDTO } from "@/models/ViagemBuscaDTO";
import { buscarViagens } from "@/services/viagemService";
import { getImage } from "@/services/unsplashService";
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
  RefreshCw
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ViagemCardModal from "@/components/Viagens/ViagemCardModal";
import ViagemDetalhesModal from "@/components/Viagens/ViagemDetalhesModal";
import ValueSlider from "@/components/Common/ValueSlider";

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
    criadorNome: "",
  });const [viagens, setViagens] = useState<ViagemBuscaDTO[]>([]);
  const [imagensViagens, setImagensViagens] = useState<{ [key: number]: string }>({});  const [loading, setLoading] = useState(false);
  const [carregandoTela, setCarregandoTela] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [viagemSelecionada, setViagemSelecionada] = useState<ViagemBuscaDTO | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [viagemDetalhesId, setViagemDetalhesId] = useState<number | null>(null);useEffect(() => {
    if (isAuthenticated === true) {
      setTimeout(() => setCarregandoTela(false), 300);
    }

    if (isAuthenticated === false) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated]);

  const buscarViagensIniciais = async () => {
    try {
      const res = await buscarViagens({});
      setViagens(res);
      await carregarImagens(res);
    } catch (err: any) {
      console.warn("Erro ao carregar viagens iniciais:", err);
    }
  };
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (value === "" ? undefined : value),
    }));
  };
  const handleValorMaximoChange = (valor: number) => {
    setFiltros((prev) => ({
      ...prev,
      valorMedioMax: valor,
    }));
  };
  const carregarImagens = async (viagensLista: ViagemBuscaDTO[]) => {
    const novasImagens: { [key: number]: string } = {};
    
    await Promise.all(
      viagensLista.map(async (viagem) => {
        try {
          const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
          novasImagens[viagem.id] = imagem || "/images/common/beach.jpg";
        } catch (error) {
          console.warn(`Erro ao carregar imagem para viagem ${viagem.id}:`, error);
          novasImagens[viagem.id] = "/images/common/beach.jpg";
        }
      })
    );
    
    setImagensViagens(novasImagens);
  }; 
  const buscar = async () => {
    setLoading(true);
    try {
      const filtrosLimpos = limparFiltros({
        ...filtros,
        destino: filtros.destino?.trim() || undefined,
        criadorNome: filtros.criadorNome?.trim() || undefined,
        valorMedioMax: filtros.valorMedioMax === 0 ? undefined : filtros.valorMedioMax,
      });

      const filtrosParaEnviar = Object.keys(filtrosLimpos).length === 0 ? {} : filtrosLimpos;
      
      const res = await buscarViagens(filtrosParaEnviar);
      setViagens(res);
      await carregarImagens(res);
      if (res.length === 0) {
        toast.info("Nenhuma viagem encontrada.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao buscar viagens");
    } finally {
      setLoading(false);
    }
  };const limparTodosFiltros = () => {    setFiltros({
      destino: "",
      estiloViagem: undefined,
      categoriaViagem: undefined,
      dataInicio: "",
      dataFim: "",
      valorMedioMax: 0,
      status: undefined,
      criadorNome: "",
    });
  };const formatarData = (dataISO: string) => {
    if (!dataISO) return "Data inválida";
    const data = new Date(dataISO);
    return !isNaN(data.getTime()) ? data.toLocaleDateString("pt-BR") : "Data inválida";
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
          src={imagensViagens[viagem.id] || "/images/common/beach.jpg"}
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
              {formatarData(viagem.dataInicio)} - {formatarData(viagem.dataFim)}
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

        <motion.button
          className="w-full bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            abrirSolicitacaoParticipacao(viagem);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plane className="w-4 h-4" />
          Solicitar Participação
        </motion.button>
      </div>
    </motion.div>
  );
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
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

        {/* Floating particles */}
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

        {/* Animated icons */}
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

        {/* Gradient orbs */}
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Encontre viagens incríveis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra aventuras únicas e participe de experiências inesquecíveis pelo mundo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8"
        >
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex flex-1 items-center border border-gray-300 rounded-xl px-4 py-3 bg-white/70">
                <Search className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar por destino, cidade, país..."
                  value={filtros.destino}
                  onChange={e => setFiltros(prev => ({ ...prev, destino: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      buscar();
                    }
                  }}
                  className="w-full outline-none bg-transparent"
                />
              </div>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 whitespace-nowrap transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
              <button
                onClick={buscar}
                className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg shadow font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2"
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
            </div>
            <p className="text-xs text-gray-500 ml-1">
              Digite o destino e pressione <span className="font-semibold">Enter</span> ou clique em "Buscar Viagens".
            </p>
          </div>          
          <AnimatePresence>
            {mostrarFiltros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden bg-gray-50/80 rounded-xl p-6 border border-gray-200/50 mb-6 shadow-sm backdrop-blur-sm"
              >                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Tipo do destino</label>                    <select
                      name="categoriaViagem"
                      value={filtros.categoriaViagem || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white/80 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="NACIONAL">Nacional</option>
                      <option value="INTERNACIONAL">Internacional</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Estilo</label>                    <select
                      name="estiloViagem"
                      value={filtros.estiloViagem || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white/80 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    ><option value="">Todos os estilos</option>
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
                    <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>                    <select
                      name="status"
                      value={filtros.status || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white/80 focus:ring-2 focus:ring-primary focus:border-primary transition-all"                    ><option value="">Todos os status</option>
                      <option value="PENDENTE">🟡 Pendente</option>
                      <option value="CONFIRMADA">🔵 Confirmada</option>
                    </select>
                  </div>
                </div>               
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Data Inicial (de)</label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={filtros.dataInicio}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white/80 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Data Inicial (até)</label>
                    <input
                      type="date"
                      name="dataFim"
                      value={filtros.dataFim}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white/80 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div><div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Criador</label>
                    <input
                      type="text"
                      name="criadorNome"
                      placeholder="Nome do criador..."
                      value={filtros.criadorNome}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white/80 focus:ring-2 focus:ring-primary focus:border-primary transition-all"                    />
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={buscar}
                      className="flex-1 bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-3 rounded-xl hover:shadow-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
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
                          Buscar
                        </>
                      )}
                    </button>
                    <button
                      onClick={limparTodosFiltros}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Limpar
                    </button>
                  </div>
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {viagens.map((viagem) => renderCardViagem(viagem))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>     
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
          imagemViagem={viagemDetalhesId ? imagensViagens[viagemDetalhesId] : undefined}
        />
      )}
    </div>
  );
};

export default EncontreViagens;
