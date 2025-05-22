"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaMapMarkedAlt, FaDoorOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePerfil } from "@/app/context/PerfilContext";
import { deletarViagem, sairDaViagem } from "@/services/viagemService";
import { toast } from "sonner";
import { confirm } from "@/components/ui/confirm";

const MinhasViagens = () => {
  const router = useRouter();
  const { viagens, imagensViagens, atualizarViagens } = usePerfil();

  const [ordenacao, setOrdenacao] = useState<"dataDesc" | "dataAsc" | "az" | "za">("dataDesc");
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS");
  const [filtroTipo, setFiltroTipo] = useState<"TODOS" | "CRIADOR" | "PARTICIPANTE">("TODOS");

  const viagensFiltradas = useMemo(() => {
    return viagens.filter((v) => {
      const statusOk = filtroStatus === "TODOS" || v.viagem.status === filtroStatus;
      const tipoOk =
        filtroTipo === "TODOS" ||
        (filtroTipo === "CRIADOR" && v.criador) ||
        (filtroTipo === "PARTICIPANTE" && !v.criador);
      return statusOk && tipoOk;
    });
  }, [viagens, filtroStatus, filtroTipo]);

  const viagensOrdenadas = useMemo(() => {
    const copia = [...viagensFiltradas];
    switch (ordenacao) {
      case "dataAsc":
        return copia.sort(
          (a, b) =>
            new Date(a.viagem.dataInicio + "T12:00:00").getTime() -
            new Date(b.viagem.dataInicio + "T12:00:00").getTime()
        );
      case "dataDesc":
        return copia.sort(
          (a, b) =>
            new Date(b.viagem.dataInicio + "T12:00:00").getTime() -
            new Date(a.viagem.dataInicio + "T12:00:00").getTime()
        );
      case "az":
        return copia.sort((a, b) => a.viagem.destino.localeCompare(b.viagem.destino));
      case "za":
        return copia.sort((a, b) => b.viagem.destino.localeCompare(a.viagem.destino));
      default:
        return copia;
    }
  }, [viagensFiltradas, ordenacao]);

  const handleEditar = (id: number) => {
    router.push(`/viagens/editar/${id}`);
  };

  const handleDeletar = async (id: number) => {
    const confirmacao = await confirm({
      title: "Confirmar Exclusão",
      description: "Tem certeza que deseja excluir esta viagem? Essa ação não poderá ser desfeita.",
      cancelText: "Cancelar",
    });

    if (!confirmacao) return;

    try {
      await deletarViagem(id);
      toast.success("Viagem deletada com sucesso!");
      await atualizarViagens();
    } catch (error) {
      toast.error("Erro ao deletar viagem. Tente novamente.");
    }
  };

  const handleSairDaViagem = async (id: number) => {
    const confirmacao = await confirm({
      title: "Sair da Viagem",
      description: "Tem certeza que deseja sair desta viagem?",
      cancelText: "Cancelar",
    });

    if (!confirmacao) return;

    try {
      await sairDaViagem(id);
      toast.success("Você saiu da viagem.");
      router.push("/profile?tab=viagens"); // 🔥 Redireciona para aba de viagens no perfil
    } catch (error) {
      toast.error("Erro ao sair da viagem. Tente novamente.");
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6">Minhas Viagens</h2>

      <div className="mb-6 -mt-4 flex flex-wrap justify-between w-full max-w-5xl z-10 relative gap-4">
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="TODOS">🧭 Todos os Status</option>
          <option value="RASCUNHO">📌 Rascunho</option>
          <option value="PENDENTE">⏳ Pendente</option>
          <option value="CONFIRMADA">✅ Confirmada</option>
          <option value="EM_ANDAMENTO">🛫 Em andamento</option>
          <option value="CONCLUIDA">🏁 Concluída</option>
          <option value="CANCELADA">❌ Cancelada</option>
        </select>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as any)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="TODOS">👥 Todos</option>
          <option value="CRIADOR">🧑‍✈️ Onde sou criador</option>
          <option value="PARTICIPANTE">🧳 Onde sou participante</option>
        </select>

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as any)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="dataDesc">📅 Mais recentes</option>
          <option value="dataAsc">📅 Mais antigas</option>
          <option value="az">🔤 A-Z</option>
          <option value="za">🔤 Z-A</option>
        </select>
      </div>

      {viagensOrdenadas.length === 0 ? (
        <div className="text-gray-500">Nenhuma viagem encontrada com esse filtro.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {viagensOrdenadas.map(({ viagem, criador }) => (
            <motion.div
              key={viagem.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 cursor-pointer"
              onClick={() => {
                if (criador) handleEditar(viagem.id);
              }}
            >
              <div className="relative w-full h-48">
                <img
                  src={imagensViagens[viagem.id] || "/images/common/beach.jpg"}
                  alt={viagem.destino}
                  className={`object-cover w-full h-48 rounded-t-2xl transition-all duration-500 ease-in-out ${
                    ["CONCLUIDA", "CANCELADA"].includes(viagem.status) ? "grayscale" : ""
                  }`}
                />
              </div>

              <div className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-center">
                  {viagem.destino} {!criador && <span className="text-xs text-gray-500">(Participante)</span>}
                </h3>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full mb-2 capitalize ${
                    viagem.status === "CONFIRMADA"
                      ? "bg-green-100 text-green-800"
                      : viagem.status === "EM_ANDAMENTO"
                      ? "bg-blue-100 text-blue-800"
                      : viagem.status === "CONCLUIDA"
                      ? "bg-gray-200 text-gray-700"
                      : viagem.status === "CANCELADA"
                      ? "bg-red-100 text-red-800"
                      : viagem.status === "PENDENTE"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {viagem.status.replace("_", " ").toLowerCase()}
                </span>

                <p className="text-sm text-gray-500 text-center mb-4">
                  De {new Date(viagem.dataInicio + "T12:00:00").toLocaleDateString("pt-BR")} até{" "}
                  {new Date(viagem.dataFim + "T12:00:00").toLocaleDateString("pt-BR")}
                </p>

                <div className="flex justify-center gap-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/viagens/cadastrarRoteiro?viagemId=${viagem.id}`);
                    }}
                    className="text-purple-600 hover:text-purple-800"
                    title="Ver Roteiro"
                  >
                    <FaMapMarkedAlt size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/viagens/${viagem.id}/participantes`);
                    }}
                    className="text-green-600 hover:text-green-800"
                    title="Ver Participantes"
                  >
                    👥
                  </button>
                  {criador ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditar(viagem.id);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletar(viagem.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <FaTrash size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSairDaViagem(viagem.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Sair da Viagem"
                    >
                      <FaDoorOpen size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => router.push("/viagens/cadastrar")}
        className="mt-8 flex items-center gap-2 bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-orange-600"
      >
        <span>✈️</span>
        Cadastrar Viagem
      </motion.button>
    </motion.div>
  );
};

export default MinhasViagens;
