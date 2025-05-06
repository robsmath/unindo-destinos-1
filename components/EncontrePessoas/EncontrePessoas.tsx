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

const EncontrePessoas = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [filtros, setFiltros] = useState<UsuarioFiltroDTO>({
    genero: "",
    idadeMin: "",
    idadeMax: "",
    petFriendly: undefined,
    aceitaCriancas: undefined,
    aceitaFumantes: undefined,
    aceitaBebidasAlcoolicas: undefined,
    acomodacaoCompartilhada: undefined,
    aceitaAnimaisGrandePorte: undefined,
    tipoAcomodacao: "NAO_TENHO_PREFERENCIA",
    tipoTransporte: "NAO_TENHO_PREFERENCIA",
  });

  const [usuarios, setUsuarios] = useState<UsuarioBuscaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioBuscaDTO | null>(null);
  const [minhasViagens, setMinhasViagens] = useState<ViagemDTO[]>([]);
  const [viagemSelecionadaId, setViagemSelecionadaId] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated === false) router.replace("/auth/signin");
  }, [isAuthenticated]);

  if (isAuthenticated === false) return null;

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

  const buscar = async () => {
    setLoading(true);
    try {
      const filtrosLimpos: any = {
        genero: filtros.genero || null,
        idadeMin: filtros.idadeMin || null,
        idadeMax: filtros.idadeMax || null,
        tipoAcomodacao: filtros.tipoAcomodacao,
        tipoTransporte: filtros.tipoTransporte,
      };

      if (filtros.petFriendly) filtrosLimpos.petFriendly = true;
      if (filtros.aceitaCriancas) filtrosLimpos.aceitaCriancas = true;
      if (filtros.aceitaFumantes) filtrosLimpos.aceitaFumantes = true;
      if (filtros.aceitaBebidasAlcoolicas) filtrosLimpos.aceitaBebidasAlcoolicas = true;
      if (filtros.acomodacaoCompartilhada) filtrosLimpos.acomodacaoCompartilhada = true;
      if (filtros.aceitaAnimaisGrandePorte) filtrosLimpos.aceitaAnimaisGrandePorte = true;

      const response = await buscarUsuarios(filtrosLimpos);
      setUsuarios(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalConvite = async (usuario: UsuarioBuscaDTO) => {
    try {
      const response = await getMinhasViagens();
      setMinhasViagens(response);
      setUsuarioSelecionado(usuario);
      setViagemSelecionadaId("");
      setShowModal(true);
    } catch {
      toast.error("Erro ao carregar suas viagens");
    }
  };

  const confirmarConvite = async () => {
    if (!viagemSelecionadaId) {
      toast.error("Selecione uma viagem");
      return;
    }

    toast.success(`Convite enviado para ${usuarioSelecionado?.nome}`);
    setShowModal(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/common/beach.jpg')` }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
            Encontre sua companhia de viagem! 🌍✈️
          </h1>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <select name="genero" value={filtros.genero} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="">Gênero</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTRO">Outro</option>
            </select>

            <input type="number" name="idadeMin" placeholder="Idade Mínima" value={filtros.idadeMin} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full" />
            <input type="number" name="idadeMax" placeholder="Idade Máxima" value={filtros.idadeMax} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full" />

            <select name="tipoAcomodacao" value={filtros.tipoAcomodacao} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
              <option value="HOTEL">Hotel</option>
              <option value="HOSTEL">Hostel</option>
              <option value="AIRBNB">Airbnb</option>
              <option value="POUSADA">Pousada</option>
              <option value="CAMPING">Camping</option>
              <option value="RESORT">Resort</option>
              <option value="FAZENDA">Fazenda</option>
              <option value="CASA_DE_AMIGOS">Casa de Amigos</option>
            </select>

            <select name="tipoTransporte" value={filtros.tipoTransporte} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full">
              <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
              <option value="AVIAO">Avião</option>
              <option value="CARRO">Carro</option>
              <option value="ONIBUS">Ônibus</option>
              <option value="TREM">Trem</option>
              <option value="NAVIO">Navio</option>
              <option value="MOTO">Moto</option>
              <option value="BICICLETA">Bicicleta</option>
              <option value="VAN">Van</option>
              <option value="MOTORHOME">Motorhome</option>
            </select>

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
          </div>

          <div className="text-center mt-6">
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

          <div className="mt-6">
            {usuarios.length === 0 && !loading ? (
              <p className="text-center text-gray-500">Nenhum resultado encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usuarios.map((user) => (
                  <div key={user.id} className="bg-white p-6 rounded-xl shadow-md text-center min-h-[460px] flex flex-col justify-between">
                    <div>
                      <Image
                        src={user.fotoPerfil?.startsWith("http") ? user.fotoPerfil : "/images/user/avatar.png"}
                        alt="Foto"
                        width={100}
                        height={100}
                        className="rounded-full mx-auto mb-3"
                      />
                      <h2 className="text-lg font-bold">{user.nome}</h2>
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
                            <li className="italic text-gray-400">
                              Preferências de viagem não informadas.
                            </li>
                          )}
                      </ul>
                      <p className="text-sm mt-2">🏨 {user.tipoAcomodacao || "Hospedagem não informada"}</p>
                      <p className="text-sm">🚗 {user.tipoTransporte || "Transporte não informado"}</p>
                    </div>

                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700 w-full"
                      onClick={() => abrirModalConvite(user)}
                    >
                      Convidar para Viagem
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE CONVITE */}
      {showModal && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Convidar {usuarioSelecionado.nome} para qual viagem?
            </h2>
            <select
              value={viagemSelecionadaId}
              onChange={(e) => setViagemSelecionadaId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              <option value="">Selecione uma viagem</option>
              {minhasViagens.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.destino} ({v.dataInicio})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarConvite}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Enviar Convite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncontrePessoas;
