"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaMapMarkedAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePerfil } from "@/app/context/PerfilContext";
import { deletarViagem } from "@/services/viagemService";
import { toast } from "sonner";
import { confirm } from "@/components/ui/confirm";
import { Loader2 } from "lucide-react";

const MinhasViagens = () => {
  const router = useRouter();
  const { viagens, imagensViagens, atualizarViagens } = usePerfil();

  const [ordenacao, setOrdenacao] = useState<"dataDesc" | "dataAsc" | "az" | "za">("dataDesc");

  const viagensOrdenadas = useMemo(() => {
    const copia = [...viagens];
    switch (ordenacao) {
      case "dataAsc":
        return copia.sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
      case "dataDesc":
        return copia.sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime());
      case "az":
        return copia.sort((a, b) => a.destino.localeCompare(b.destino));
      case "za":
        return copia.sort((a, b) => b.destino.localeCompare(a.destino));
      default:
        return copia;
    }
  }, [viagens, ordenacao]);

  const handleEditar = (id: number) => {
    router.push(`/viagens/editar/${id}`);
  };

  const handleDeletar = async (id: number) => {
    const confirmacao = await confirm({
      title: "Confirmar Exclusão",
      description: "Tem certeza que deseja excluir esta viagem? Essa ação não poderá ser desfeita.",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
    });

    if (!confirmacao) return;

    try {
      await deletarViagem(id);
      toast.success("Viagem deletada com sucesso!", { position: "top-center" });
      await atualizarViagens(); // atualiza o contexto
    } catch (error) {
      console.error("Erro ao deletar viagem", error);
      toast.error("Erro ao deletar viagem. Tente novamente.", { position: "top-center" });
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-6">Minhas Viagens</h2>

      <div className="mb-4 flex justify-end w-full max-w-5xl">
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

      {viagens.length === 0 ? (
        <div className="text-gray-500">Você ainda não cadastrou nenhuma viagem.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {viagensOrdenadas.map((viagem) => (
            <motion.div
              key={viagem.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden w-80"
            >
              <div className="relative w-full h-48">
                <img
                  src={imagensViagens[viagem.id] || "/images/common/beach.jpg"}
                  alt={viagem.destino}
                  className="object-cover w-full h-48 rounded-t-2xl transition-all duration-500 ease-in-out"
                />
              </div>

              <div className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-center">{viagem.destino}</h3>
                <p className="text-sm text-gray-500 text-center mb-4">
                  De {new Date(viagem.dataInicio).toLocaleDateString("pt-BR")} até {new Date(viagem.dataFim).toLocaleDateString("pt-BR")}
                </p>
                <div className="flex justify-center gap-5">
                  <button
                    onClick={() => router.push(`/viagens/cadastrarRoteiro?viagemId=${viagem.id}`)}
                    className="text-purple-600 hover:text-purple-800"
                    title="Ver Roteiro"
                  >
                    <FaMapMarkedAlt size={18} />
                  </button>
                  <button
                    onClick={() => handleEditar(viagem.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletar(viagem.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir"
                  >
                    <FaTrash size={18} />
                  </button>
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
    </div>
  );
};

export default MinhasViagens;
