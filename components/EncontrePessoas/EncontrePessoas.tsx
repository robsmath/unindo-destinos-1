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

const EncontrePessoas = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [filtros, setFiltros] = useState<UsuarioFiltroDTO>({
    genero: "",
    idadeMin: "",
    idadeMax: "",
    petFriendly: false,
    aceitaCriancas: false,
    aceitaFumantes: false,
    aceitaBebidasAlcoolicas: false,
    acomodacaoCompartilhada: false,
    aceitaAnimaisGrandePorte: false,
    tipoHospedagem: "",
    transporteFavorito: "",
  });

  const [usuarios, setUsuarios] = useState<UsuarioBuscaDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioBuscaDTO | null>(null);
  const [minhasViagens, setMinhasViagens] = useState<ViagemDTO[]>([]);
  const [viagemSelecionadaId, setViagemSelecionadaId] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFiltros((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setFiltros((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const buscar = async () => {
    try {
      const response = await buscarUsuarios(filtros);
      setUsuarios(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao buscar usuários");
    }
  };

  const abrirModalConvite = async (usuario: UsuarioBuscaDTO) => {
    try {
      const response = await getMinhasViagens();
      setMinhasViagens(response); // espera-se que já venha como ViagemDTO[]
      setUsuarioSelecionado(usuario);
      setViagemSelecionadaId(""); // limpa seleção anterior
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

    // aqui você chamaria o service de convite futuramente
    toast.success(`Convite enviado para ${usuarioSelecionado?.nome}`);
    setShowModal(false);
  };

  useEffect(() => {
    if (!isAuthenticated) router.replace("/signin");
  }, [isAuthenticated]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Encontre Pessoas para Viajar</h1>

      {/* Modal de convite */}
      {showModal && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">
              Convidar {usuarioSelecionado.nome}
            </h2>

            <select
              className="w-full border rounded px-3 py-2 mb-4"
              value={viagemSelecionadaId}
              onChange={(e) => setViagemSelecionadaId(e.target.value)}
            >
              <option value="">Selecione uma viagem</option>
              {minhasViagens.map((v) => (
                <option key={v.id} value={v.id}>
                {v.destino}
              </option>          
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={confirmarConvite}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select name="genero" value={filtros.genero} onChange={handleChange}>
          <option value="">Todos os Gêneros</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
          <option value="OUTRO">Outro</option>
        </select>

        <input
          type="number"
          name="idadeMin"
          placeholder="Idade Mínima"
          value={filtros.idadeMin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="idadeMax"
          placeholder="Idade Máxima"
          value={filtros.idadeMax}
          onChange={handleChange}
        />
        <input
          name="tipoHospedagem"
          placeholder="Tipo de Hospedagem"
          value={filtros.tipoHospedagem}
          onChange={handleChange}
        />
        <input
          name="transporteFavorito"
          placeholder="Transporte Favorito"
          value={filtros.transporteFavorito}
          onChange={handleChange}
        />

        {/* Booleanos */}
        {[
          "petFriendly",
          "aceitaCriancas",
          "aceitaFumantes",
          "aceitaBebidasAlcoolicas",
          "acomodacaoCompartilhada",
          "aceitaAnimaisGrandePorte",
        ].map((campo) => (
          <label key={campo} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={campo}
              checked={filtros[campo as keyof UsuarioFiltroDTO] as boolean}
              onChange={handleChange}
            />
            {campo.replace(/([A-Z])/g, " $1")}
          </label>
        ))}
      </div>

      <button
        onClick={buscar}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Buscar
      </button>

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {usuarios.map((user) => (
          <div key={user.id} className="border rounded p-4 shadow-md bg-white">
            <Image
              src={user.fotoPerfil || "/images/user/avatar.png"}
              alt="Foto"
              width={100}
              height={100}
              className="rounded-full mb-2"
            />
            <h2 className="text-lg font-semibold">{user.nome}</h2>
            <p>
              {user.genero} - {user.idade} anos
            </p>
            <ul className="text-sm mt-2">
              {user.petFriendly && <li>🐶 Pet Friendly</li>}
              {user.aceitaCriancas && <li>👶 Aceita Crianças</li>}
              {user.aceitaFumantes && <li>🚬 Aceita Fumantes</li>}
              {user.aceitaBebidasAlcoolicas && <li>🍷 Aceita Bebidas</li>}
              {user.acomodacaoCompartilhada && <li>🛏️ Acomodação Compartilhada</li>}
              {user.aceitaAnimaisGrandePorte && <li>🐘 Aceita Animais Grandes</li>}
            </ul>
            <p className="text-sm mt-2">🏨 {user.tipoHospedagem}</p>
            <p className="text-sm">🚗 {user.transporteFavorito}</p>

            <button
              className="bg-green-600 text-white px-3 py-1 rounded mt-4 w-full"
              onClick={() => abrirModalConvite(user)}
            >
              Convidar para minha viagem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EncontrePessoas;
