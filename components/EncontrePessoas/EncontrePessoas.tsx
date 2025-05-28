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
  MapPin 
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
    valorMedioMin: "",
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
    email: ""
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
  const [idadeMinimaInput, setIdadeMinimaInput] = useState(filtros.idadeMin?.toString() || "");
  const [idadeMaximaInput, setIdadeMaximaInput] = useState(filtros.idadeMax?.toString() || "");

  const [valorMedioMinInput, setValorMedioMinInput] = useState(
    filtros.valorMedioMin !== null && filtros.valorMedioMin !== undefined
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(filtros.valorMedioMin as number)
      : ""
  );

  const [valorMedioMaxInput, setValorMedioMaxInput] = useState(
    filtros.valorMedioMax !== null && filtros.valorMedioMax !== undefined
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(filtros.valorMedioMax as number)
      : ""
  );


  useEffect(() => {
    const carregarPreferenciasDiretamente = async () => {
      try {
        const prefs = await getPreferenciasDoUsuario();
        if (!prefs) return;

        setFiltros((prev) => ({
          ...prev,
          genero: ["MASCULINO", "FEMININO", "OUTRO", "NAO_BINARIO"].includes(prefs.generoPreferido)
            ? (prefs.generoPreferido as UsuarioFiltroDTO["genero"])
            : "",
          idadeMin: typeof prefs.idadeMinima === "number" ? prefs.idadeMinima : "",
          idadeMax: typeof prefs.idadeMaxima === "number" ? prefs.idadeMaxima : "",
          valorMedioMin: typeof prefs.valorMedioViagem === "number" ? prefs.valorMedioViagem : "",
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
    const valorMin = filtros.valorMedioMin;
    const valorMax = filtros.valorMedioMax;

    if (idadeMin !== "" && idadeMax !== "" && Number(idadeMin) > Number(idadeMax)) {
      toast.warning("A idade mínima não pode ser maior que a idade máxima.");
      return;
    }

    if (valorMin !== "" && valorMax !== "" && Number(valorMin) > Number(valorMax)) {
      toast.warning("O valor mínimo não pode ser maior que o valor máximo.");
      return;
    }

    setLoading(true);
    try {
      const filtrosLimpos: any = {
        genero: filtros.genero || null,
        idadeMin: filtros.idadeMin || null,
        idadeMax: filtros.idadeMax || null,
        valorMedioMin: filtros.valorMedioMin || null,
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
      valorMedioMin: "",
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
      email: ""
    });
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

  const atualizarIdade = (campo: "idadeMin" | "idadeMax", valor: number) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleValorMedioChange = (
  campo: "valorMedioMin" | "valorMedioMax",
  e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "");
    const valor = raw ? parseFloat(raw) / 100 : "";

    const formatado =
      valor !== ""
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
        : "";

    if (campo === "valorMedioMin") {
      setValorMedioMinInput(formatado);
    } else {
      setValorMedioMaxInput(formatado);
    }

    setFiltros((prev) => ({
      ...prev,
      [campo]: valor === "" ? "" : Number(valor),
    }));
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/images/common/beach.jpg')` }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          {carregandoTela ? (
            <div className="flex justify-center items-center h-[300px]">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Carregando...</span>
            </div>
          ) : (
            <>              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                Encontre sua companhia de viagem
              </h1>

              <div className="flex flex-col gap-1 mb-4">
  <div className="flex flex-col md:flex-row items-center gap-4">
    <div className="flex flex-1 items-center border border-gray-300 rounded px-4 py-2">
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
        className="w-full outline-none"
      />
    </div>    <button
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
</div>              {/* Dropdown de Filtros */}
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
  </div>

  {/* Valor Médio */}
  <div>
    <label className="text-sm text-gray-600 block mb-1">
      Valor Médio (Mín. - Máx.) (R$)
    </label>
    <div className="flex gap-2">
      <input
        type="text"
        name="valorMedioMin"
        placeholder="Mín."
        value={valorMedioMinInput}
        onChange={(e) => handleValorMedioChange("valorMedioMin", e)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      <input
        type="text"
        name="valorMedioMax"
        placeholder="Máx."
        value={valorMedioMaxInput}
        onChange={(e) => handleValorMedioChange("valorMedioMax", e)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
    </div>
  </div>
</div>                      {/* Checkboxes */}
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
                      </div>                      {/* Botões */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                          onClick={buscar}
                          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-colors duration-200 font-medium flex-1"
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

              {/* Lista de usuários */}
              <div className="mt-8">
                {usuarios.length === 0 && !loading ? (
                  <p className="text-center text-gray-500">
                    Nenhum resultado encontrado.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {usuarios.map((user) => (
                      <div
                        key={user.id}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center min-h-[520px] flex flex-col justify-between cursor-pointer"
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
                          </h2>                          <p className="text-gray-600 flex items-center justify-center gap-1">
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
                        </div>                        <button
                          className="bg-orange-600 text-white px-4 py-3 rounded-lg mt-4 hover:bg-orange-700 w-full font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors duration-200"
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
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
