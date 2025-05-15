"use client";

import { useEffect, useState } from "react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { UsuarioFiltroDTO } from "@/models/UsuarioFiltroDTO";
import { buscarUsuarios } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import Image from "next/image";
import { ViagemDTO } from "@/models/ViagemDTO";
import { getMinhasViagens } from "@/services/viagemService";
import { Loader2 } from "lucide-react";
import MiniPerfilModal from "@/components/EncontrePessoas/MiniPerfilModal";
import { FaCheckCircle } from "react-icons/fa";
import ConviteViagemModal from "@/components/EncontrePessoas/ConviteViagemModal";
import { getPreferenciasDoUsuario } from "@/services/preferenciasService";


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
    aceitaAnimaisGrandePorte: undefined,
    tipoAcomodacao: "NAO_TENHO_PREFERENCIA",
    tipoTransporte: "NAO_TENHO_PREFERENCIA",
    apenasVerificados: false,
  });

  const [usuarios, setUsuarios] = useState<UsuarioBuscaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregandoTela, setCarregandoTela] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioBuscaDTO | null>(null);
  const [minhasViagens, setMinhasViagens] = useState<ViagemDTO[]>([]);
  const [viagemSelecionadaId, setViagemSelecionadaId] = useState<string>("");
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [carregandoConvite, setCarregandoConvite] = useState(false);
  const [usuarioCarregandoId, setUsuarioCarregandoId] = useState<number | null>(null);

  useEffect(() => {
    const carregarPreferenciasDiretamente = async () => {
      try {
        const prefs = await getPreferenciasDoUsuario();
        if (!prefs) return;
  
        setFiltros({
          genero: ["MASCULINO", "FEMININO", "OUTRO"].includes(prefs.generoPreferido)
            ? prefs.generoPreferido as "MASCULINO" | "FEMININO" | "OUTRO"
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
          aceitaAnimaisGrandePorte: prefs.aceitaAnimaisGrandePorte,
          tipoAcomodacao: prefs.tipoAcomodacao || "NAO_TENHO_PREFERENCIA",
          tipoTransporte: prefs.tipoTransporte || "NAO_TENHO_PREFERENCIA",
          apenasVerificados: true,
        });
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
  

  if (!isAuthenticated) {
    return null;
  }
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    setFiltros((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value,
    }));
  };

  const formatarTexto = (valor: string | null | undefined) => {
    if (!valor || valor === "NAO_TENHO_PREFERENCIA") return "Não tenho preferência";
    return valor.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  };

  const extrairPrimeiroEUltimoNome = (nome: string) => {
    const partes = nome.trim().split(" ");
    if (partes.length <= 2) return nome;
    return `${partes[0]} ${partes[partes.length - 1]}`;
  };

  const buscar = async () => {
    const idadeMin = filtros.idadeMin;
    const idadeMax = filtros.idadeMax;
    const valorMin = filtros.valorMedioMin;
    const valorMax = filtros.valorMedioMax;
  
    if (
      idadeMin !== "" &&
      idadeMax !== "" &&
      Number(idadeMin) > Number(idadeMax)
    ) {
      toast.warning("A idade mínima não pode ser maior que a idade máxima.");
      return;
    }
  
    if (
      valorMin !== "" &&
      valorMax !== "" &&
      Number(valorMin) > Number(valorMax)
    ) {
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
      };
  
      if (filtros.petFriendly) filtrosLimpos.petFriendly = true;
      if (filtros.aceitaCriancas) filtrosLimpos.aceitaCriancas = true;
      if (filtros.aceitaFumantes) filtrosLimpos.aceitaFumantes = true;
      if (filtros.aceitaBebidasAlcoolicas) filtrosLimpos.aceitaBebidasAlcoolicas = true;
      if (filtros.acomodacaoCompartilhada) filtrosLimpos.acomodacaoCompartilhada = true;
      if (filtros.aceitaAnimaisGrandePorte) filtrosLimpos.aceitaAnimaisGrandePorte = true;
      if (filtros.apenasVerificados) filtrosLimpos.apenasVerificados = true;
  
      const response = await buscarUsuarios(filtrosLimpos);
      setUsuarios(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };
  
  const abrirModalConvite = async (usuario: UsuarioBuscaDTO, fecharOutroModal?: () => void) => {
    setUsuarioCarregandoId(usuario.id);
    try {
      const response = await getMinhasViagens();
      setMinhasViagens(response);
      setUsuarioSelecionado(usuario);
      setViagemSelecionadaId("");
      if (fecharOutroModal) fecharOutroModal();
      setTimeout(() => setShowModal(true), 150);
    } catch {
      toast.error("Erro ao carregar suas viagens");
    } finally {
      setUsuarioCarregandoId(null);
    }
  };
  

  const confirmarConvite = async () => {
    if (!viagemSelecionadaId) {
      toast.error("Selecione uma viagem");
      return;
    } 
    setCarregandoConvite(true);  
    try {
      toast.success(`Convite enviado para ${usuarioSelecionado?.nome}`);
      setShowModal(false);
    } catch {
      toast.error("Erro ao enviar convite");
    } finally {
      setCarregandoConvite(false);
    }
  };  

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
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
          <>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Encontre sua companhia de viagem! 🌍✈️
          </h1>

          {/* FILTROS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[
              { label: "Gênero", name: "genero", options: ["", "MASCULINO", "FEMININO", "OUTRO"] },
              { label: "Idade Mínima", name: "idadeMin", type: "number" },
              { label: "Idade Máxima", name: "idadeMax", type: "number" },
              {
                label: "Tipo de Acomodação",
                name: "tipoAcomodacao",
                options: [
                  "NAO_TENHO_PREFERENCIA", "HOTEL", "HOSTEL", "AIRBNB",
                  "POUSADA", "CAMPING", "RESORT", "FAZENDA", "CASA_DE_AMIGOS"
                ]
              },
              {
                label: "Tipo de Transporte",
                name: "tipoTransporte",
                options: [
                  "NAO_TENHO_PREFERENCIA", "AVIAO", "CARRO", "ONIBUS",
                  "TREM", "NAVIO", "MOTO", "BICICLETA", "VAN", "MOTORHOME"
                ]
              }
            ].map((field, idx) => (
              <div key={idx}>
                <label className="text-sm text-gray-600 block mb-1">{field.label}</label>
                {field.options ? (
                  <select
                    name={field.name}
                    value={filtros[field.name as keyof UsuarioFiltroDTO] as string}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {formatarTexto(opt)}
                      </option>
                    ))}
                  </select>
                ) : field.name === "idadeMin" ? (
                  <input
                    type="number"
                    name="idadeMin"
                    min={18}
                    value={filtros.idadeMin}
                    onChange={handleChange}
                    onBlur={() => {
                      const min = Number(filtros.idadeMin);
                      const max = Number(filtros.idadeMax);
                      if (min < 18) {
                        toast.warning("A idade mínima não pode ser menor que 18.");
                        setFiltros((prev) => ({ ...prev, idadeMin: 18 }));
                      } else if (filtros.idadeMax && min > max) {
                        toast.warning("A idade mínima não pode ser maior que a máxima.");
                        setFiltros((prev) => ({ ...prev, idadeMin: max }));
                      }
                    }}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                ) : (
                  <input
                    type="number"
                    name="idadeMax"
                    min={18}
                    value={filtros.idadeMax}
                    onChange={handleChange}
                    onBlur={() => {
                      const max = Number(filtros.idadeMax);
                      const min = Number(filtros.idadeMin);
                      if (max < 18) {
                        toast.warning("A idade máxima não pode ser menor que 18.");
                        setFiltros((prev) => ({ ...prev, idadeMax: 18 }));
                      } else if (filtros.idadeMin && min > max) {
                        toast.warning("A idade máxima não pode ser menor que a mínima.");
                        setFiltros((prev) => ({ ...prev, idadeMax: min }));
                      }
                    }}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
            {[
              { nome: "petFriendly", label: "🐶 Pet Friendly" },
              { nome: "aceitaCriancas", label: "👶 Aceita Crianças" },
              { nome: "aceitaFumantes", label: "🚬 Aceita Fumantes" },
              { nome: "aceitaBebidasAlcoolicas", label: "🍷 Aceita Bebidas" },
              { nome: "acomodacaoCompartilhada", label: "🛏️ Acomodação Compartilhada" },
              { nome: "aceitaAnimaisGrandePorte", label: "🐘 Animais de Grande Porte" },
            ].map(({ nome, label }) => (
              <label key={nome} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name={nome}
                  checked={!!filtros[nome as keyof UsuarioFiltroDTO]}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
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
              ✅ Apenas perfis verificados
            </label>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="w-1/2">
              <label className="text-sm text-gray-600 block mb-1">Valor Médio Mínimo (R$)</label>
              <input
                type="text"
                name="valorMedioMin"
                value={
                  filtros.valorMedioMin !== "" && filtros.valorMedioMin !== undefined
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(filtros.valorMedioMin))
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const valor = raw ? parseFloat(raw) / 100 : "";
                  const max = filtros.valorMedioMax;
                  if (valor !== "" && max !== "" && Number(valor) > Number(max)) {
                    toast.warning("O valor mínimo não pode ser maior que o valor máximo.");
                    return;
                  }
                  setFiltros((prev) => ({ ...prev, valorMedioMin: valor }));
                }}
                placeholder="Ex: 1000"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>

            <div className="w-1/2">
              <label className="text-sm text-gray-600 block mb-1">Valor Médio Máximo (R$)</label>
              <input
                type="text"
                name="valorMedioMax"
                value={
                  filtros.valorMedioMax !== "" && filtros.valorMedioMax !== undefined
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(filtros.valorMedioMax))
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const valor = raw ? parseFloat(raw) / 100 : "";
                  setFiltros((prev) => ({ ...prev, valorMedioMax: valor }));
                }}
                onBlur={() => {
                  const min = Number(filtros.valorMedioMin);
                  const max = Number(filtros.valorMedioMax);
                  if (min && max && max < min) {
                    toast.warning("O valor máximo não pode ser menor que o valor mínimo.");
                    setFiltros((prev) => ({ ...prev, valorMedioMax: "" }));
                  }
                }}
                placeholder="Ex: 3000"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />

            </div>
          </div>
          <div className="text-center">
            <button
              onClick={buscar}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 shadow"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Buscando...
                </span>
              ) : (
                <>🔍 Buscar Pessoas</>
              )}
            </button>
          </div>

          <div className="text-center mt-2">
            <button
             onClick={() => setFiltros({
              genero: "",
              idadeMin: 18,
              idadeMax: "",
              petFriendly: undefined,
              aceitaCriancas: undefined,
              aceitaFumantes: undefined,
              aceitaBebidasAlcoolicas: undefined,
              acomodacaoCompartilhada: undefined,
              aceitaAnimaisGrandePorte: undefined,
              tipoAcomodacao: "NAO_TENHO_PREFERENCIA",
              tipoTransporte: "NAO_TENHO_PREFERENCIA",
            })}            
              className="text-sm text-gray-600 hover:underline"
            >
              Limpar filtros 🔄
            </button>
          </div>

          <div className="mt-6">
            {usuarios.length === 0 && !loading ? (
              <p className="text-center text-gray-500">Nenhum resultado encontrado.</p>
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
                        src={user.fotoPerfil?.startsWith("http") ? user.fotoPerfil : "/images/user/avatar.png"}
                        alt="Foto"
                        width={100}
                        height={100}
                        className="rounded-full mx-auto mb-3 object-cover aspect-square"
                      />
                      <h2 className="text-lg font-bold flex items-center justify-center gap-1">
                        {extrairPrimeiroEUltimoNome(user.nome)}
                        {user.emailVerificado && user.telefoneVerificado && (
                          <FaCheckCircle title="Perfil verificado" className="text-green-600" />
                        )}
                      </h2>
                      <p className="text-gray-600">{user.genero} • {user.idade} anos</p>
                      <ul className="text-sm text-left mt-3 space-y-1">
                        {user.petFriendly && <li>🐶 Pet Friendly</li>}
                        {user.aceitaCriancas && <li>👶 Aceita Crianças</li>}
                        {user.aceitaFumantes && <li>🚬 Aceita Fumantes</li>}
                        {user.aceitaBebidasAlcoolicas && <li>🍷 Aceita Bebidas</li>}
                        {user.acomodacaoCompartilhada && <li>🛏️ Acomodação Compartilhada</li>}
                        {user.aceitaAnimaisGrandePorte && <li>🐘 Animais Grandes</li>}
                        {!user.petFriendly &&
                          !user.aceitaCriancas &&
                          !user.aceitaFumantes &&
                          !user.aceitaBebidasAlcoolicas &&
                          !user.acomodacaoCompartilhada &&
                          !user.aceitaAnimaisGrandePorte && (
                            <li className="italic text-gray-400 text-center">
                              Preferências de viagem não informadas.
                            </li>
                          )}
                        <li>🏨 {formatarTexto(user.tipoAcomodacao)}</li>
                        <li>🚗 {formatarTexto(user.tipoTransporte)}</li>
                      </ul>
                    </div>

                    <button
                      className="bg-orange-600 text-white px-4 py-2 rounded mt-4 hover:bg-orange-700 w-full font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
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
                          👋 Convidar para Viagem
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
              viagemSelecionadaId={viagemSelecionadaId}
              setViagemSelecionadaId={setViagemSelecionadaId}
              carregando={carregandoConvite}
              onConfirmar={confirmarConvite}
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
