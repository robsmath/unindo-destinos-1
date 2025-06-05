"use client";

import { useEffect, useState } from "react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { UsuarioFiltroDTO } from "@/models/UsuarioFiltroDTO";
import { buscarUsuarios } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import Image from "next/image";
import { MinhasViagensDTO } from "@/models/MinhasViagensDTO";
import { getMinhasViagens } from "@/services/viagemService";
import {
  Loader2,
  Search,
  SlidersHorizontal,
  Heart,
  Baby,
  Cigarette,
  Wine,
  Bed,
  Plane,
  Car,
  Bus,
  Train,
  Ship,
  Bike,
  Home,
  Building,
  Mountain,
  Trees,
  Tent,
  Hotel,
  Users,
  RotateCcw,
  Mail,
  User,
  RefreshCw,
  Filter,
  MapPin,
} from "lucide-react";
import MiniPerfilModal from "@/components/EncontrePessoas/MiniPerfilModal";
import { FaCheckCircle } from "react-icons/fa";
import ConviteViagemModal from "@/components/EncontrePessoas/ConviteViagemModal";
import { getPreferenciasDoUsuario } from "@/services/preferenciasService";
import { AnimatePresence, motion } from "framer-motion";
import { useDenunciaEBloqueio } from "@/hooks/useDenunciaEBloqueio";
import DenunciaModal from "@/components/Modals/DenunciaModal";
import BloqueioModal from "@/components/Modals/BloqueioModal";
import PerguntaBloqueioModal from "@/components/Modals/PerguntaBloqueioModal";
import DenunciaEBloqueioButtons from "@/components/Common/DenunciaEBloqueioButtons";

const EncontrePessoas = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [filtros, setFiltros] = useState<UsuarioFiltroDTO>({
    genero: "",
    idadeMin: "",
    idadeMax: "",
    valorMedioMax: "",
    petFriendly: undefined,
    aceitaCriancas: undefined,
    aceitaFumantes: undefined,
    aceitaBebidasAlcoolicas: undefined,
    acomodacaoCompartilhada: undefined,
    tipoAcomodacao: "NAO_TENHO_PREFERENCIA",
    tipoTransporte: "NAO_TENHO_PREFERENCIA",
    apenasVerificados: false,
    nome: "",
    email: "",
  });

  const [buscarPor, setBuscarPor] = useState<"nome" | "email">("nome");
  const [usuarios, setUsuarios] = useState<UsuarioBuscaDTO[]>([]);
  const [minhasViagens, setMinhasViagens] = useState<MinhasViagensDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregandoTela, setCarregandoTela] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioBuscaDTO | null>(null);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [usuarioCarregandoId, setUsuarioCarregandoId] = useState<number | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [carregandoPreferencias, setCarregandoPreferencias] = useState(false);
  const [valorMedioMaxInput, setValorMedioMaxInput] = useState(
    filtros.valorMedioMax !== null && filtros.valorMedioMax !== undefined
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(filtros.valorMedioMax as number)
      : ""
  );

  // Hook para denúncia e bloqueio
  const {
    denunciaModalOpen,
    bloqueioModalOpen,
    perguntaBloqueioModalOpen,
    usuarioSelecionado: usuarioParaDenunciarBloquear,
    abrirDenunciaModal,
    abrirBloqueioModal,
    fecharDenunciaModal,
    fecharBloqueioModal,
    fecharPerguntaBloqueioModal,
    handleDenunciaEnviada,
    handleBloquearAposDenuncia,
    handleNaoBloquearAposDenuncia,
    handleUsuarioBloqueado,
  } = useDenunciaEBloqueio();

  const handleDenunciar = (usuario: { id: number; nome: string }) => {
    abrirDenunciaModal(usuario);
  };

  const handleBloquear = (usuario: { id: number; nome: string }) => {
    abrirBloqueioModal(usuario);
  };

  const handleUsuarioBloqueadoComRemocao = () => {
    if (usuarioParaDenunciarBloquear) {
      // Remove o usuário da lista local
      setUsuarios(prev => prev.filter(u => u.id !== usuarioParaDenunciarBloquear.id));
    }
    handleUsuarioBloqueado();
  };

  const handleBloquearAposDenunciaComRemocao = async () => {
    if (usuarioParaDenunciarBloquear) {
      // Remove o usuário da lista local
      setUsuarios(prev => prev.filter(u => u.id !== usuarioParaDenunciarBloquear.id));
    }
    await handleBloquearAposDenuncia();
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      setTimeout(() => setCarregandoTela(false), 300);
    }

    if (isAuthenticated === false) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInputBusca = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (buscarPor === "nome") {
      setFiltros((prev) => ({ ...prev, nome: valor, email: "" }));
    } else {
      setFiltros((prev) => ({ ...prev, email: valor, nome: "" }));
    }
  };

  const formatarTexto = (valor: string | null | undefined) => {
    if (!valor || valor === "NAO_TENHO_PREFERENCIA") return "Não tenho preferência";
    return valor.replaceAll("_", " ").replace(/\b\w/g, (c) =>
      c.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
  };
  const extrairPrimeiroEUltimoNome = (nome: string) => {
    const partes = nome.trim().split(" ");
    if (partes.length <= 2) return nome;
    return `${partes[0]} ${partes[partes.length - 1]}`;
  };
  const getIconeAcomodacao = (tipo: string | undefined) => {
    if (!tipo) return Home;
    const iconMap: { [key: string]: any } = {
      HOTEL: Hotel,
      HOSTEL: Building,
      AIRBNB: Home,
      POUSADA: Home,
      CAMPING: Tent,
      RESORT: Building,
      FAZENDA: Trees,
      CASA_DE_AMIGOS: Home,
    };
    return iconMap[tipo] || Home;
  };

  const getIconeTransporte = (tipo: string | undefined) => {
    if (!tipo) return Car;
    const iconMap: { [key: string]: any } = {
      AVIAO: Plane,
      CARRO: Car,
      ONIBUS: Bus,
      TREM: Train,
      NAVIO: Ship,
      MOTO: Bike,
      BICICLETA: Bike,
      VAN: Bus,
      MOTORHOME: Car,
    };
    return iconMap[tipo] || Car;
  };
  const buscar = async () => {
    const idadeMin = filtros.idadeMin;
    const idadeMax = filtros.idadeMax;

    if (idadeMin !== "" && idadeMax !== "" && Number(idadeMin) > Number(idadeMax)) {
      toast.warning("A idade mínima não pode ser maior que a idade máxima.");
      return;
    }

    setLoading(true);
    try {
      const filtrosLimpos: any = {
        genero: filtros.genero || null,
        idadeMin: filtros.idadeMin || null,
        idadeMax: filtros.idadeMax || null,
        valorMedioMax: filtros.valorMedioMax || null,
        tipoAcomodacao: filtros.tipoAcomodacao,
        tipoTransporte: filtros.tipoTransporte,
        nome: filtros.nome || null,
        email: filtros.email || null,
      };

      // Só adiciona checkboxes que estão definidos
      if (filtros.petFriendly !== undefined) filtrosLimpos.petFriendly = filtros.petFriendly;
      if (filtros.aceitaCriancas !== undefined) filtrosLimpos.aceitaCriancas = filtros.aceitaCriancas;
      if (filtros.aceitaFumantes !== undefined) filtrosLimpos.aceitaFumantes = filtros.aceitaFumantes;
      if (filtros.aceitaBebidasAlcoolicas !== undefined) filtrosLimpos.aceitaBebidasAlcoolicas = filtros.aceitaBebidasAlcoolicas;
      if (filtros.acomodacaoCompartilhada !== undefined) filtrosLimpos.acomodacaoCompartilhada = filtros.acomodacaoCompartilhada;
      if (filtros.apenasVerificados !== undefined) filtrosLimpos.apenasVerificados = filtros.apenasVerificados;

      const response = await buscarUsuarios(filtrosLimpos);
      setUsuarios(response);
    } catch (err: any) {
      console.error("Erro na busca:", err);
      console.error("Detalhes do erro:", {
        response: err?.response,
        data: err?.response?.data,
        message: err?.response?.data?.message,
        fullError: err
      });
      
      // Verifica se é o erro específico de não ter viagens cadastradas
      const errorMessage = err?.response?.data?.message || err?.message || "";
      
      if (errorMessage.includes("pelo menos uma viagem cadastrada")) {
        toast.warning("Você precisa ter pelo menos uma viagem cadastrada para buscar pessoas.", {
          action: {
            label: "Cadastrar Viagem",
            onClick: () => router.push("/minhas-viagens")
          }
        });
      } else {
        toast.error(err?.response?.data?.message || "Erro na busca. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setFiltros({
      genero: "",
      idadeMin: "",
      idadeMax: "",
      valorMedioMax: "",
      petFriendly: undefined,
      aceitaCriancas: undefined,
      aceitaFumantes: undefined,
      aceitaBebidasAlcoolicas: undefined,
      acomodacaoCompartilhada: undefined,
      tipoAcomodacao: "NAO_TENHO_PREFERENCIA",
      tipoTransporte: "NAO_TENHO_PREFERENCIA",
      apenasVerificados: false,
      nome: "",
      email: "",
    });
    setValorMedioMaxInput("");
    setUsuarios([]);
  };

  const abrirModalConvite = async (usuario: UsuarioBuscaDTO, fecharOutroModal?: () => void) => {
    fecharOutroModal?.();
    setUsuarioCarregandoId(usuario.id);
    try {
      const minhasViagensResponse = await getMinhasViagens();
      setMinhasViagens(minhasViagensResponse);
      setUsuarioSelecionado(usuario);
      setShowModal(true);
    } catch (err) {
      toast.error("Erro ao carregar suas viagens.");
    } finally {
      setUsuarioCarregandoId(null);
    }
  };

  const handleValorMedioChange = (
    campo: "valorMedioMax",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const valor = e.target.value;
    setValorMedioMaxInput(valor);

    // Remove caracteres não numéricos para conversão
    const numeroLimpo = valor.replace(/[^\d]/g, "");
    const numeroConvertido = numeroLimpo ? parseInt(numeroLimpo) / 100 : "";

    setFiltros((prev) => ({
      ...prev,
      [campo]: numeroConvertido,
    }));
  };

  const importarPreferencias = async () => {
    setCarregandoPreferencias(true);
    try {
      const prefs = await getPreferenciasDoUsuario();
      if (!prefs) {
        toast.info("Nenhuma preferência encontrada para importar.");
        return;
      }

      setFiltros((prev) => ({
        ...prev,
        genero: ["MASCULINO", "FEMININO", "OUTRO", "NAO_BINARIO"].includes(prefs.generoPreferido)
          ? (prefs.generoPreferido as UsuarioFiltroDTO["genero"])
          : "",
        idadeMin: typeof prefs.idadeMinima === "number" ? prefs.idadeMinima : "",
        idadeMax: typeof prefs.idadeMaxima === "number" ? prefs.idadeMaxima : "",
        petFriendly: prefs.petFriendly,
        aceitaCriancas: prefs.aceitaCriancas,
        aceitaFumantes: prefs.aceitaFumantes,
        aceitaBebidasAlcoolicas: prefs.aceitaBebidasAlcoolicas,
        acomodacaoCompartilhada: prefs.acomodacaoCompartilhada,
        tipoAcomodacao: prefs.tipoAcomodacao || "NAO_TENHO_PREFERENCIA",
        tipoTransporte: prefs.tipoTransporte || "NAO_TENHO_PREFERENCIA",
        apenasVerificados: true,
      }));
      
      toast.success("Preferências importadas com sucesso!");
    } catch (err) {
      console.error("Erro ao buscar preferências do usuário:", err);
      toast.error("Erro ao importar preferências.");
    } finally {
      setCarregandoPreferencias(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buscar();
    }
  };

  if (isAuthenticated === false || carregandoTela) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

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
          <Users className="w-8 h-8 text-blue-500/30 drop-shadow-lg" />
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
          <User className="w-6 h-6 text-red-500/30 drop-shadow-lg" />
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
          <Heart className="w-7 h-7 text-pink-500/30 drop-shadow-lg" />
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
          <Mail className="w-6 h-6 text-green-500/30 drop-shadow-lg" />
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
          <RefreshCw className="w-6 h-6 text-indigo-500/30 drop-shadow-lg" />
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
          <Filter className="w-5 h-5 text-teal-500/30 drop-shadow-lg" />
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

      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Encontre Pessoas</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent mb-4 leading-tight">
              Encontre Companheiros de Viagem
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Conecte-se com pessoas que compartilham dos mesmos interesses e descubra novos destinos juntos
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 md:p-6 mb-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Buscar por:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={buscarPor}
                    onChange={(e) => setBuscarPor(e.target.value as "nome" | "email")}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:w-auto w-full"
                  >
                    <option value="nome">Nome</option>
                    <option value="email">E-mail</option>
                  </select>
                  <input
                    type={buscarPor === "email" ? "email" : "text"}
                    placeholder={buscarPor === "nome" ? "Digite o nome..." : "Digite o e-mail..."}
                    value={buscarPor === "nome" ? filtros.nome : filtros.email}
                    onChange={handleInputBusca}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  />
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={buscar}
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
                      Buscar Pessoas
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtros Avançados</span>
                  <span className="sm:hidden">Filtros</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filtros Avançados */}
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
                
                {/* Linha 1: Gênero + Acomodação + Transporte */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Gênero */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Gênero</label>
                    <select
                      name="genero"
                      value={filtros.genero}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Qualquer</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="NAO_BINARIO">Não-binário</option>
                      <option value="OUTRO">Outro</option>
                    </select>
                  </div>
                  {/* Tipo de Acomodação */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Tipo de Acomodação
                    </label>
                    <select
                      name="tipoAcomodacao"
                      value={filtros.tipoAcomodacao}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {[
                        "NAO_TENHO_PREFERENCIA",
                        "HOTEL",
                        "HOSTEL",
                        "AIRBNB",
                        "POUSADA",
                        "CAMPING",
                        "RESORT",
                        "FAZENDA",
                        "CASA_DE_AMIGOS",
                      ].map((op) => (
                        <option key={op} value={op}>
                          {formatarTexto(op)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Tipo de Transporte */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Tipo de Transporte
                    </label>
                    <select
                      name="tipoTransporte"
                      value={filtros.tipoTransporte}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {[
                        "NAO_TENHO_PREFERENCIA",
                        "AVIAO",
                        "CARRO",
                        "ONIBUS",
                        "TREM",
                        "NAVIO",
                        "MOTO",
                        "BICICLETA",
                        "VAN",
                        "MOTORHOME",
                      ].map((op) => (
                        <option key={op} value={op}>
                          {formatarTexto(op)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Linha 2: Idades + Valor Médio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {/* Idade Mínima */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Idade Mínima</label>
                    <input
                      type="number"
                      name="idadeMin"
                      min={18}
                      value={filtros.idadeMin}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  {/* Idade Máxima */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Idade Máxima</label>
                    <input
                      type="number"
                      name="idadeMax"
                      min={18}
                      value={filtros.idadeMax}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  {/* Valor Médio Máximo */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Valor Médio Máximo (R$)
                    </label>
                    <input
                      type="text"
                      name="valorMedioMax"
                      placeholder="Valor máximo..."
                      value={valorMedioMaxInput}
                      onChange={(e) => handleValorMedioChange("valorMedioMax", e)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Checkboxes */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 block mb-3">Preferências de Viagem</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                          checked={!!filtros[nome as keyof UsuarioFiltroDTO]}
                          onChange={handleChange}
                          className="accent-primary rounded"
                        />
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span>{label}</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        name="apenasVerificados"
                        checked={!!filtros.apenasVerificados}
                        onChange={handleChange}
                        className="accent-green-600 rounded"
                      />
                      <FaCheckCircle className="w-4 h-4 text-green-600" />
                      <span>Apenas perfis verificados</span>
                    </label>
                  </div>
                </div>

                {/* Botões dentro dos filtros */}
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
                    onClick={limparFiltros}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors duration-200 font-medium flex-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpar Filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lista de usuários */}
          <div className="mt-8">
            {loading ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">Buscando pessoas...</p>
                </div>
              </motion.div>
            ) : usuarios.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma pessoa encontrada</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros critérios.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
              >
                {usuarios.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(234,88,12,0.10)" }}
                    className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col justify-between min-h-[520px] cursor-pointer border border-primary/10"
                    onClick={(e) => {
                      const clicouNoBotao = (e.target as HTMLElement).closest("button");
                      if (!clicouNoBotao) {
                        setUsuarioSelecionado(user);
                        setModalPerfilAberto(true);
                      }
                    }}
                  >
                    <div>
                      <Image
                        src={
                          user.fotoPerfil?.startsWith("http")
                            ? user.fotoPerfil
                            : "/images/user/avatar.png"
                        }
                        alt="Foto"
                        width={100}
                        height={100}
                        className="rounded-full mx-auto mb-3 object-cover aspect-square"
                      />
                      <h2 className="text-lg font-bold flex items-center justify-center gap-1">
                        {extrairPrimeiroEUltimoNome(user.nome)}
                        {user.emailVerificado && user.telefoneVerificado && (
                          <FaCheckCircle
                            title="Perfil verificado"
                            className="text-green-600"
                          />
                        )}
                      </h2>
                      <p className="text-gray-600 flex items-center justify-center gap-1">
                        <User className="w-4 h-4" />
                        {user.genero} • {user.idade} anos
                      </p>
                      <ul className="text-sm text-left mt-3 space-y-2">
                        {user.petFriendly && (
                          <li className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            Pet Friendly
                          </li>
                        )}
                        {user.aceitaCriancas && (
                          <li className="flex items-center gap-2">
                            <Baby className="w-4 h-4 text-blue-500" />
                            Aceita Crianças
                          </li>
                        )}
                        {user.aceitaFumantes && (
                          <li className="flex items-center gap-2">
                            <Cigarette className="w-4 h-4 text-gray-500" />
                            Aceita Fumantes
                          </li>
                        )}
                        {user.aceitaBebidasAlcoolicas && (
                          <li className="flex items-center gap-2">
                            <Wine className="w-4 h-4 text-purple-500" />
                            Aceita Bebidas
                          </li>
                        )}
                        {user.acomodacaoCompartilhada && (
                          <li className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-orange-500" />
                            Acomodação Compartilhada
                          </li>
                        )}
                        {!user.petFriendly &&
                          !user.aceitaCriancas &&
                          !user.aceitaFumantes &&
                          !user.aceitaBebidasAlcoolicas &&
                          !user.acomodacaoCompartilhada && (
                            <li className="italic text-gray-400 text-center">
                              Preferências de viagem não informadas.
                            </li>
                          )}
                        {(() => {
                          const IconeAcomodacao = getIconeAcomodacao(user.tipoAcomodacao);
                          return (
                            <li className="flex items-center gap-2">
                              <IconeAcomodacao className="w-4 h-4 text-green-600" />
                              {formatarTexto(user.tipoAcomodacao)}
                            </li>
                          );
                        })()}
                        {(() => {
                          const IconeTransporte = getIconeTransporte(user.tipoTransporte);
                          return (
                            <li className="flex items-center gap-2">
                              <IconeTransporte className="w-4 h-4 text-blue-600" />
                              {formatarTexto(user.tipoTransporte)}
                            </li>
                          );
                        })()}
                      </ul>
                    </div>
                    
                    {/* Ações */}
                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                      {/* Botão Convidar */}
                      <button
                        className="bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-3 rounded-xl hover:scale-105 font-semibold flex items-center justify-center gap-2 w-full disabled:opacity-60 transition-all duration-200"
                        onClick={() => abrirModalConvite(user)}
                        disabled={usuarioCarregandoId === user.id}
                      >
                        {usuarioCarregandoId === user.id ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            <span className="text-sm sm:text-base">Carregando...</span>
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4" />
                            <span className="text-sm sm:text-base">Convidar para Viagem</span>
                          </>
                        )}
                      </button>

                      {/* Botões de Denúncia e Bloqueio */}
                      <div className="flex justify-center">
                        <DenunciaEBloqueioButtons
                          usuario={user}
                          onDenunciar={handleDenunciar}
                          onBloquear={handleBloquear}
                          size="sm"
                          layout="horizontal"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* MODAL DE CONVITE */}
        {showModal && usuarioSelecionado && (
          <ConviteViagemModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            usuario={usuarioSelecionado}
            viagens={minhasViagens}
          />
        )}

        {/* MODAL DE MINI PERFIL */}
        {modalPerfilAberto && usuarioSelecionado && (
          <MiniPerfilModal
            usuario={usuarioSelecionado}
            isOpen={modalPerfilAberto}
            onClose={() => setModalPerfilAberto(false)}
            onConvidar={() => abrirModalConvite(usuarioSelecionado)}
            onDenunciar={handleDenunciar}
            onBloquear={handleBloquear}
          />
        )}

        {/* Modais de Denúncia e Bloqueio */}
        {usuarioParaDenunciarBloquear && (
          <>
            <DenunciaModal
              isOpen={denunciaModalOpen}
              onClose={fecharDenunciaModal}
              usuarioId={usuarioParaDenunciarBloquear.id}
              usuarioNome={usuarioParaDenunciarBloquear.nome}
              onDenunciaEnviada={handleDenunciaEnviada}
            />

            <BloqueioModal
              isOpen={bloqueioModalOpen}
              onClose={fecharBloqueioModal}
              usuarioId={usuarioParaDenunciarBloquear.id}
              usuarioNome={usuarioParaDenunciarBloquear.nome}
              onUsuarioBloqueado={handleUsuarioBloqueadoComRemocao}
            />
          </>
        )}

        {/* Modal de Pergunta de Bloqueio - renderizado separadamente */}
        {usuarioParaDenunciarBloquear && (
          <PerguntaBloqueioModal
            isOpen={perguntaBloqueioModalOpen}
            onClose={fecharPerguntaBloqueioModal}
            usuarioNome={usuarioParaDenunciarBloquear.nome}
            onBloquear={handleBloquearAposDenunciaComRemocao}
            onNaoBloquear={handleNaoBloquearAposDenuncia}
          />
        )}
      </div>
    </div>
  );
};

export default EncontrePessoas;