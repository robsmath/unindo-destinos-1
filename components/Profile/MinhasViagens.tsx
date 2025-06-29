"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePerfil } from "@/app/context/PerfilContext";
import { deletarViagem } from "@/services/viagemService";
import { toast } from "sonner";
import { confirm } from "@/components/ui/confirm";
import ViagemDetalhesModal from "@/components/Viagens/ViagemDetalhesModal";
import SairViagemModal from "@/components/Modals/SairViagemModal";
import SmartImage from "@/components/Common/SmartImage";
import { useCacheInvalidation } from "@/components/Profile/hooks/useCacheInvalidation";
import { formatarPeriodoViagem } from "@/utils/dateUtils";
import { 
  Loader2, 
  Edit, 
  Trash2, 
  MapPin, 
  LogOut, 
  Users, 
  Plane
} from "lucide-react";

const MinhasViagens = () => {
  const router = useRouter();
  const { viagens, recarregarViagens } = usePerfil();
  const { registerInvalidationCallback, unregisterInvalidationCallback } = useCacheInvalidation();

  const [ordenacao, setOrdenacao] = useState<"dataDesc" | "dataAsc" | "az" | "za">("dataDesc");
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS");
  const [filtroTipo, setFiltroTipo] = useState<"TODOS" | "CRIADOR" | "PARTICIPANTE">("TODOS");
  const [viagemSelecionadaId, setViagemSelecionadaId] = useState<number | null>(null);
  const [sairViagemModal, setSairViagemModal] = useState<{ aberto: boolean; viagemId: number | null; destino: string }>({ 
    aberto: false, 
    viagemId: null, 
    destino: "" 
  });

  const [loadingCadastrar, setLoadingCadastrar] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{[key: string]: boolean}>({});

  const formatarStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      "RASCUNHO": "Rascunho",
      "PENDENTE": "Pendente", 
      "CONFIRMADA": "Confirmada",
      "EM_ANDAMENTO": "Em Andamento",
      "CONCLUIDA": "Concluída",
      "CANCELADA": "Cancelada"
    };
    
    return statusMap[status] || status;
  };

  useEffect(() => {
    const invalidateCallback = () => {
      recarregarViagens();
    };
    
    registerInvalidationCallback('viagens', invalidateCallback);
    
    return () => {
      unregisterInvalidationCallback('viagens');
    };
  }, [registerInvalidationCallback, unregisterInvalidationCallback, recarregarViagens]);

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
  const handleDeletar = async (id: number) => {
    const actionKey = `delete-${id}`;
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
    
    const confirmacao = await confirm({
      title: "Confirmar Exclusão",
      description: "Tem certeza que deseja excluir esta viagem? Essa ação não poderá ser desfeita.",
      cancelText: "Cancelar",
    });

    if (!confirmacao) {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
      return;
    }    try {
      await deletarViagem(id);
      toast.success("Viagem deletada com sucesso!");
      await recarregarViagens();
    } catch (error) {
      toast.error("Erro ao deletar viagem. Tente novamente.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };
  const handleAbrirModalSair = (viagemId: number, destino: string) => {
    setSairViagemModal({
      aberto: true,
      viagemId,
      destino
    });
  };

  const handleFecharModalSair = () => {
    setSairViagemModal({
      aberto: false,
      viagemId: null,
      destino: ""
    });
  };

  const handleSaidaConfirmada = async () => {
    await recarregarViagens();
  };

  return (
    <>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Minhas Viagens
            </span>
          </h2>
          <p className="text-gray-600">Gerencie todas as suas aventuras e descobertas</p>
        </div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-6 shadow-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="RASCUNHO">Rascunho</option>
                <option value="PENDENTE">Pendente</option>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="EM_ANDAMENTO">Em andamento</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              >
                <option value="TODOS">Todos</option>
                <option value="CRIADOR">Onde sou criador</option>
                <option value="PARTICIPANTE">Onde sou participante</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ordenação</label>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as any)}
                className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              >
                <option value="dataDesc">Mais recentes</option>
                <option value="dataAsc">Mais antigas</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>
        </motion.div>

        {viagensOrdenadas.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma viagem encontrada</h3>
              <p className="text-gray-500">Não encontramos viagens com os filtros selecionados.</p>
            </div>
          </motion.div>        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.05 }}
          >
            {viagensOrdenadas.map(({ viagem, criador }, index) => (              <motion.div
                key={viagem.id}
                className="group bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ y: -1 }}
                onClick={() => setViagemSelecionadaId(viagem.id)}
              >
                <div className="relative h-48 overflow-hidden">                  <SmartImage
                                              src={viagem.imagemUrl || "/images/common/beach.jpg"}
                    alt={viagem.destino}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${
                      ["CONCLUIDA", "CANCELADA"].includes(viagem.status) ? "grayscale" : ""
                    }`}
                    fallbackSrc="/images/common/beach.jpg"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30 ${
                        viagem.status === "CONFIRMADA"
                          ? "bg-green-500/80 text-white"
                          : viagem.status === "EM_ANDAMENTO"
                          ? "bg-blue-500/80 text-white"
                          : viagem.status === "CONCLUIDA"
                          ? "bg-gray-500/80 text-white"
                          : viagem.status === "CANCELADA"
                          ? "bg-red-500/80 text-white"
                          : viagem.status === "PENDENTE"
                          ? "bg-yellow-500/80 text-white"
                          : "bg-gray-400/80 text-white"                      }`}
                    >
                      {formatarStatus(viagem.status)}
                    </span>
                  </div>

                  {!criador && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/80 text-white backdrop-blur-sm border border-white/30">
                        Participante
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
                    {viagem.destino}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                        {formatarPeriodoViagem(viagem.dataInicio, viagem.dataFim)}
                  </p>

                  <div className="flex justify-between items-center gap-3">
                    <div className="flex gap-2">                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          const actionKey = `roteiro-${viagem.id}`;
                          setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
                          router.push(`/viagens/cadastrarRoteiro?viagemId=${viagem.id}`);
                        }}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                        title="Ver Roteiro"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loadingActions[`roteiro-${viagem.id}`] ? <Loader2 className="animate-spin w-4 h-4" /> : <MapPin size={16} />}
                      </motion.button>
                      
                      <motion.button                        onClick={(e) => {
                          e.stopPropagation();
                          const actionKey = `participantes-${viagem.id}`;
                          setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
                          router.push(`/viagens/${viagem.id}/participantes`);
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                        title="Ver Participantes"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loadingActions[`participantes-${viagem.id}`] ? <Loader2 className="animate-spin w-4 h-4" /> : <Users size={16} />}
                      </motion.button>
                    </div>

                    <div className="flex gap-2">
                      {criador ? (
                        <>                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              const actionKey = `edit-${viagem.id}`;
                              setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
                              router.push(`/viagens/editar/${viagem.id}`);
                            }}                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            title="Editar"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {loadingActions[`edit-${viagem.id}`] ? <Loader2 className="animate-spin w-4 h-4" /> : <Edit size={16} />}
                          </motion.button>
                          
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletar(viagem.id);
                            }}                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            title="Excluir"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {loadingActions[`delete-${viagem.id}`] ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={16} />}
                          </motion.button>
                        </>
                      ) : (                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAbrirModalSair(viagem.id, viagem.destino);
                          }}                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          title="Sair da Viagem"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogOut size={16} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >          <motion.button
            onClick={() => {
              setLoadingCadastrar(true);
              router.push("/viagens/cadastrar");
            }}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            disabled={loadingCadastrar}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <span className="relative z-10 flex items-center gap-3">
              {loadingCadastrar ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Plane className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              )}
              {loadingCadastrar ? "Redirecionando..." : "Nova Viagem"}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {viagemSelecionadaId && (
        <ViagemDetalhesModal
          viagemId={viagemSelecionadaId}
          open={viagemSelecionadaId !== null}
          onClose={() => setViagemSelecionadaId(null)}
          imagemViagem={viagemSelecionadaId ? viagens.find(v => v.viagem.id === viagemSelecionadaId)?.viagem.imagemUrl : undefined}
        />
      )}

      {sairViagemModal.aberto && sairViagemModal.viagemId && (
        <SairViagemModal
          isOpen={sairViagemModal.aberto}
          onClose={handleFecharModalSair}
          viagemId={sairViagemModal.viagemId}
          viagemDestino={sairViagemModal.destino}
          onSaidaConfirmada={handleSaidaConfirmada}
        />
      )}
    </>
  );
};

export default MinhasViagens;
