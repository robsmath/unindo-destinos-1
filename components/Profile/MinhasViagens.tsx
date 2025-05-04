"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { getMinhasViagens, deletarViagem } from "@/services/viagemService";
import { ViagemDTO } from "@/models/ViagemDTO";
import { Loader2 } from "lucide-react";
import { getImage } from "@/services/googleImageService";
import { toast } from "sonner";
import { confirm } from "@/components/ui/confirm";

const MinhasViagens = () => {
  const router = useRouter();

  const [viagens, setViagens] = useState<ViagemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagensViagens, setImagensViagens] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = async () => {
    try {
      const response = await getMinhasViagens();
      setViagens(response);

      const novasImagens: { [key: number]: string } = {};

      await Promise.all(
        response.map(async (viagem) => {
          const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
          novasImagens[viagem.id] = imagem || "/images/common/beach.jpg";
        })
      );

      setImagensViagens(novasImagens);
    } catch (error) {
      console.error("Erro ao carregar viagens", error);
    } finally {
      setLoading(false);
    }
  };

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
      carregarViagens();
    } catch (error) {
      console.error("Erro ao deletar viagem", error);
      toast.error("Erro ao deletar viagem. Tente novamente.", { position: "top-center" });
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-6">Minhas Viagens</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {viagens.map((viagem) => (
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
                <h3 className="text-lg font-semibold mb-2 text-center">{viagem.destino}</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditar(viagem.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeletar(viagem.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash size={20} />
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
