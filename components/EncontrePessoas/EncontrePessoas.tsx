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
  const [valorMedioMaxInput, setValorMedioMaxInput] = useState(
    filtros.valorMedioMax !== null && filtros.valorMedioMax !== undefined
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(filtros.valorMedioMax as number)
      : ""
  );

  useEffect(() => {
    const carregarPreferenciasDiretamente = async () => {
      try {
        const prefs = await getPreferenciasDoUsuario();
        if (!prefs) return;        setFiltros((prev) => ({
          ...prev,
          genero: ["MASCULINO", "FEMININO", "OUTRO", "NAO_BINARIO"].includes(prefs.generoPreferido)
            ? (prefs.generoPreferido as UsuarioFiltroDTO["genero"])
            : "",
          idadeMin: typeof prefs.idadeMinima === "number" ? prefs.idadeMinima : "",
          idadeMax: typeof prefs.idadeMaxima === "number" ? prefs.idadeMaxima : "",
          valorMedioMax: "",
          petFriendly: prefs.petFriendly,
          aceitaCriancas: prefs.aceitaCriancas,
          aceitaFumantes: prefs.aceitaFumantes,
          aceitaBebidasAlcoolicas: prefs.aceitaBebidasAlcoolicas,
          acomodacaoCompartilhada: prefs.acomodacaoCompartilhada,
          tipoAcomodacao: prefs.tipoAcomodacao || "NAO_TENHO_PREFERENCIA",
          tipoTransporte: prefs.tipoTransporte || "NAO_TENHO_PREFERENCIA",
          apenasVerificados: true,
        }));
      } catch (err) {
        console.error("Erro ao buscar preferências do usuário:", err);
      } finally {
        setTimeout(() => setCarregandoTela(false), 300);
      }
    };

    if (isAuthenticated === true) {
      carregarPreferenciasDiretamente();
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

      if (filtros.petFriendly) filtrosLimpos.petFriendly = true;
      if (filtros.aceitaCriancas) filtrosLimpos.aceitaCriancas = true;
      if (filtros.aceitaFumantes) filtrosLimpos.aceitaFumantes = true;
      if (filtros.aceitaBebidasAlcoolicas) filtrosLimpos.aceitaBebidasAlcoolicas = true;
      if (filtros.acomodacaoCompartilhada) filtrosLimpos.acomodacaoCompartilhada = true;
      if (filtros.apenasVerificados) filtrosLimpos.apenasVerificados = true;

      const response = await buscarUsuarios(filtrosLimpos);
      setUsuarios(response);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao buscar usuários");
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
  };

  if (!isAuthenticated) {
    return null;
  }

  const abrirModalConvite = async (usuario: UsuarioBuscaDTO, fecharOutroModal?: () => void) => {
    setUsuarioCarregandoId(usuario.id);
    try {
      const response = await getMinhasViagens();
      setMinhasViagens(response);
      setUsuarioSelecionado(usuario);
      if (fecharOutroModal) fecharOutroModal();
      setTimeout(() => setShowModal(true), 150);
    } catch {
      toast.error("Erro ao carregar suas viagens");
    } finally {
      setUsuarioCarregandoId(null);
    }
  };
  const handleValorMedioChange = (
    campo: "valorMedioMax",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "");
    const valor = raw ? parseFloat(raw) / 100 : "";

    const formatado =
      valor !== ""
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
        : "";

    setValorMedioMaxInput(formatado);

    setFiltros((prev) => ({
      ...prev,
      [campo]: valor === "" ? "" : Number(valor),
    }));
  };
  // --- MODERNIZAÇÃO VISUAL ABAIXO ---
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
          <User className="w-8 h-8 text-blue-500/30 drop-shadow-lg" />
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
          <Heart className="w-6 h-6 text-red-500/30 drop-shadow-lg" />
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
          <Users className="w-7 h-7 text-yellow-500/30 drop-shadow-lg" />
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
          <Search className="w-6 h-6 text-green-500/30 drop-shadow-lg" />
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
          <Filter className="w-8 h-8 text-purple-500/30 drop-shadow-lg" />
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
          <Baby className="w-6 h-6 text-indigo-500/30 drop-shadow-lg" />
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
          className="absolute top-16 left-56"
          animate={{ 
            y: [0, -14, 0],
            rotate: [0, -12, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        >
          <Wine className="w-6 h-6 text-purple-600/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-16 right-56"
          animate={{ 
            y: [0, 18, 0],
            x: [0, -6, 0]
          }}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
        >
          <Hotel className="w-7 h-7 text-orange-500/30 drop-shadow-lg" />
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
            Encontre sua companhia de viagem
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Busque pessoas incríveis para compartilhar experiências e aventuras pelo mundo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8"
        >
          {/* --- TODO SEU BLOCO DE BUSCA, FILTROS E BOTÕES AQUI --- */}
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex flex-1 items-center border border-gray-300 rounded px-4 py-2 bg-white/70">
                <Search className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder={
                    buscarPor === "nome" ? "Buscar por nome..." : "Buscar por e-mail..."
                  }
                  value={buscarPor === "nome" ? filtros.nome : filtros.email}
                  onChange={handleInputBusca}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      buscar();
                    }
                  }}
                  className="w-full outline-none bg-transparent"
                />
              </div>
              <button
                onClick={() => setBuscarPor(buscarPor === "nome" ? "email" : "nome")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4" />
                {buscarPor === "nome" ? "Buscar por E-mail" : "Buscar por Nome"}
              </button>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
            </div>
            <p className="text-xs text-gray-500 ml-1">
              Digite {buscarPor === "nome" ? "o nome" : "o e-mail"} e pressione{" "}
              <span className="font-semibold">Enter</span> para buscar.
            </p>
          </div>
          <AnimatePresence>
            {mostrarFiltros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden bg-gray-50 rounded-lg p-6 border mb-6 shadow-sm"
              >
                {/* Linha 1: Gênero + Tipo de Acomodação + Tipo de Transporte */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {/* Gênero */}
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Gênero</label>
                    <select
                      name="genero"
                      value={filtros.genero}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    >
                      <option value="">Todos</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="OUTRO">Outro</option>
                      <option value="NAO_BINARIO">Não Binário</option>
                    </select>
                  </div>
                  {/* Tipo de Acomodação */}
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Tipo de Acomodação
                    </label>
                    <select
                      name="tipoAcomodacao"
                      value={filtros.tipoAcomodacao}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
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
                    <label className="text-sm text-gray-600 block mb-1">
                      Tipo de Transporte
                    </label>
                    <select
                      name="tipoTransporte"
                      value={filtros.tipoTransporte}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
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
                    <label className="text-sm text-gray-600 block mb-1">Idade Mínima</label>
                    <input
                      type="number"
                      name="idadeMin"
                      min={18}
                      value={filtros.idadeMin}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                  </div>
                  {/* Idade Máxima */}
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Idade Máxima</label>
                    <input
                      type="number"
                      name="idadeMax"
                      min={18}
                      value={filtros.idadeMax}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                  </div>                  {/* Valor Médio Máximo */}
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Valor Médio Máximo (R$)
                    </label>
                    <input
                      type="text"
                      name="valorMedioMax"
                      placeholder="Valor máximo..."
                      value={valorMedioMaxInput}
                      onChange={(e) => handleValorMedioChange("valorMedioMax", e)}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>
                {/* Checkboxes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {[
                    { nome: "petFriendly", label: "Pet Friendly", icon: Heart },
                    { nome: "aceitaCriancas", label: "Aceita Crianças", icon: Baby },
                    { nome: "aceitaFumantes", label: "Aceita Fumantes", icon: Cigarette },
                    { nome: "aceitaBebidasAlcoolicas", label: "Aceita Bebidas", icon: Wine },
                    { nome: "acomodacaoCompartilhada", label: "Acomodação Compartilhada", icon: Bed },
                  ].map(({ nome, label, icon: Icon }) => (
                    <label key={nome} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name={nome}
                        checked={!!filtros[nome as keyof UsuarioFiltroDTO]}
                        onChange={handleChange}
                        className="accent-blue-600"
                      />
                      <Icon className="w-4 h-4 text-gray-600" />
                      {label}
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="apenasVerificados"
                      checked={!!filtros.apenasVerificados}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    <FaCheckCircle className="w-4 h-4 text-green-600" />
                    Apenas perfis verificados
                  </label>
                </div>
                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
                    onClick={limparFiltros}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors duration-200 font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpar filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Lista de usuários */}
<div className="mt-8">
  {usuarios.length === 0 && !loading ? (
    <p className="text-center text-gray-500">
      Nenhum resultado encontrado.
    </p>
  ) : (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      {usuarios.map((user) => (
        <motion.div
          key={user.id}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(234,88,12,0.10)" }}
          className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between min-h-[520px] cursor-pointer border border-primary/10"
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
          <button
            className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-lg mt-4 hover:scale-105 font-semibold flex items-center justify-center gap-2 w-full disabled:opacity-60 transition-all duration-200"
            onClick={() => abrirModalConvite(user)}
            disabled={usuarioCarregandoId === user.id}
          >
            {usuarioCarregandoId === user.id ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Carregando...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Convidar para Viagem
              </>
            )}
          </button>
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
        />
      )}
    </div>
  );
};

export default EncontrePessoas;