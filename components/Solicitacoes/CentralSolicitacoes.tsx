"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getMinhasSolicitacoes,
  aprovarSolicitacao,
  recusarSolicitacao,
  cancelarSolicitacao,
} from "@/services/solicitacaoService";
import { SolicitacaoParticipacaoDTO } from "@/models/SolicitacaoParticipacaoDTO";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Clock,
  Mail,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import ViagemDetalhesModal from "@/components/Viagens/ViagemDetalhesModal";
import PerfilUsuarioModal from "@/components/EncontrePessoas/PerfilUsuarioModal";
import { useTabData } from "@/components/Profile/hooks/useTabData";
import { useCacheInvalidation } from "@/components/Profile/hooks/useCacheInvalidation";
import { usePerfil } from "@/app/context/PerfilContext";

type AcaoResposta = {
  id: number;
  tipo: "ACEITAR" | "RECUSAR" | "CANCELAR";
};

const CentralSolicitacoes = () => {
  const { invalidateCache } = useCacheInvalidation();
  const { imagensViagens } = usePerfil();
  const {
    data: solicitacoes,
    loading: carregando,
    loadData: carregar,
    refreshData,
  } = useTabData<SolicitacaoParticipacaoDTO[]>(
    async () => {
      try {
        return await getMinhasSolicitacoes();
      } catch {
        toast.error("Erro ao carregar solicitações");
        throw new Error("Erro ao carregar solicitações");
      }
    },
    "solicitacoes"
  );

  const [resposta, setResposta] = useState<AcaoResposta | null>(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const [perfilAbertoId, setPerfilAbertoId] = useState<number | null>(null);
  const [viagemAbertaId, setViagemAbertaId] = useState<number | null>(null);
  const [carregandoViagemId, setCarregandoViagemId] = useState<number | null>(null);

  useEffect(() => {
    carregar();
  }, []);
  const aceitar = async (s: SolicitacaoParticipacaoDTO) => {
    setResposta({ id: s.id, tipo: "ACEITAR" });
    try {
      await aprovarSolicitacao(s.id);
      toast.success("Solicitação aprovada!");
      refreshData();
      invalidateCache(["viagens"]);
    } catch {
      toast.error("Erro ao aprovar solicitação");
    } finally {
      setResposta(null);
    }
  };

  const recusar = async (s: SolicitacaoParticipacaoDTO) => {
    setResposta({ id: s.id, tipo: "RECUSAR" });
    try {
      await recusarSolicitacao(s.id);
      toast.success("Solicitação recusada.");
      refreshData();
    } catch {
      toast.error("Erro ao recusar solicitação");
    } finally {
      setResposta(null);
    }
  };

  const cancelar = async (s: SolicitacaoParticipacaoDTO) => {
    setResposta({ id: s.id, tipo: "CANCELAR" });
    try {
      await cancelarSolicitacao(s.id);
      toast.success("Solicitação cancelada.");
      refreshData();
    } catch {
      toast.error("Erro ao cancelar solicitação");
    } finally {
      setResposta(null);
    }
  };

  const renderMensagem = (s: SolicitacaoParticipacaoDTO) => {
    const nome = s.outroUsuarioNome.split(" ").slice(0, 2).join(" ");
    const dataInicio = new Date(s.dataInicio).toLocaleDateString();
    const dataFim = new Date(s.dataFim).toLocaleDateString();

    switch (s.tipo) {
      case "CONVITE_RECEBIDO":
        return (
          <>
            🎟️ <strong>{nome}</strong> te convidou para{" "}
            <strong>{s.destino}</strong> de {dataInicio} até {dataFim}
          </>
        );
      case "CONVITE_ENVIADO":
        return (
          <>
            📤 Convite enviado para <strong>{nome}</strong> —{" "}
            <strong>{s.destino}</strong> de {dataInicio} até {dataFim}
          </>
        );
      case "SOLICITACAO_RECEBIDA":
        return (
          <>
            📬 <strong>{nome}</strong> solicitou participar de{" "}
            <strong>{s.destino}</strong> de {dataInicio} até {dataFim}
          </>
        );
      case "SOLICITACAO_ENVIADA":
        return (
          <>
            ⏳ Você solicitou participar de{" "}
            <strong>{s.destino}</strong> de {dataInicio} até {dataFim}
          </>
        );
      default:
        return null;
    }
  };

  const renderCard = (s: SolicitacaoParticipacaoDTO, index: number) => (    <motion.li
      key={s.id}
      className={`group bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6 transition-all duration-300 hover:shadow-lg overflow-hidden ${
        s.status === "APROVADA"
          ? "border-green-300/50 bg-gradient-to-r from-green-50/80 to-emerald-50/80"
          : s.status === "RECUSADA"
          ? "border-red-300/50 bg-gradient-to-r from-red-50/80 to-rose-50/80"
          : "hover:border-primary/30"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -1 }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Content Section */}
        <div className="flex-1 space-y-4">
          {/* User Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {s.outroUsuarioNome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                {s.outroUsuarioNome}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {s.outroUsuarioEmail}
              </p>
            </div>
            
            {/* Status Badge */}
            {s.status !== "PENDENTE" && (
              <div className="ml-auto">
                {s.status === "APROVADA" ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Aprovada
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    <X className="w-4 h-4" />
                    Recusada
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
            <p className="text-gray-700 leading-relaxed">{renderMensagem(s)}</p>
            
            {/* Trip Details */}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{s.destino}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {new Date(s.dataInicio).toLocaleDateString()} - {new Date(s.dataFim).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-3">            <motion.button
              onClick={() => setPerfilAbertoId(s.outroUsuarioId)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <User className="w-4 h-4" />
              Ver Perfil
            </motion.button>
              <motion.button
              onClick={() => {
                setCarregandoViagemId(s.viagemId);
                setTimeout(() => {
                  setViagemAbertaId(s.viagemId);
                  setCarregandoViagemId(null);
                }, 200);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-colors duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {carregandoViagemId === s.viagemId ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              Ver Viagem
            </motion.button>
          </div>
        </div>

        {/* Actions Section */}
        {s.status === "PENDENTE" && (
          <div className="flex flex-col gap-3 lg:min-w-[140px]">
            {["CONVITE_RECEBIDO", "SOLICITACAO_RECEBIDA"].includes(s.tipo) && (
              <>                <motion.button
                  onClick={() => aceitar(s)}
                  disabled={resposta?.id === s.id && resposta?.tipo === "ACEITAR"}
                  className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  whileHover={{ scale: resposta?.id === s.id ? 1 : 1.01 }}
                  whileTap={{ scale: resposta?.id === s.id ? 1 : 0.99 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {resposta?.id === s.id && resposta?.tipo === "ACEITAR" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Aceitar
                  </span>
                </motion.button>
                  <motion.button
                  onClick={() => recusar(s)}
                  disabled={resposta?.id === s.id && resposta?.tipo === "RECUSAR"}
                  className="group relative bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  whileHover={{ scale: resposta?.id === s.id ? 1 : 1.01 }}
                  whileTap={{ scale: resposta?.id === s.id ? 1 : 0.99 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {resposta?.id === s.id && resposta?.tipo === "RECUSAR" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    Recusar
                  </span>
                </motion.button>
              </>
            )}
            
            {["CONVITE_ENVIADO", "SOLICITACAO_ENVIADA"].includes(s.tipo) && (              <motion.button
                onClick={() => cancelar(s)}
                disabled={resposta?.id === s.id && resposta?.tipo === "CANCELAR"}
                className="group relative bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                whileHover={{ scale: resposta?.id === s.id ? 1 : 1.01 }}
                whileTap={{ scale: resposta?.id === s.id ? 1 : 0.99 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {resposta?.id === s.id && resposta?.tipo === "CANCELAR" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  Cancelar
                </span>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.li>
  );

  const pendentes = (solicitacoes || []).filter((s) => s.status === "PENDENTE");
  const historico = (solicitacoes || []).filter(
    (s) => s.status === "APROVADA" || s.status === "RECUSADA"
  );

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Central de Solicitações
          </span>
        </h2>
        <p className="text-gray-600">Gerencie convites e solicitações de viagem</p>
      </div>

      {/* Loading State */}
      {carregando && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Carregando solicitações...</p>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!carregando && pendentes.length === 0 && historico.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma solicitação</h3>
            <p className="text-gray-500">Você não possui solicitações ou convites pendentes no momento.</p>
          </div>
        </motion.div>
      )}

      {/* Pending Requests */}
      {!carregando && pendentes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Solicitações Pendentes
          </h3>
          <motion.ul 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {pendentes.map((item, index) => renderCard(item, index))}
          </motion.ul>
        </motion.div>
      )}

      {/* History Section */}
      {!carregando && historico.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setMostrarHistorico(!mostrarHistorico)}
            className="flex items-center gap-3 text-gray-700 hover:text-primary font-semibold transition-colors duration-300 mb-4 group"
            whileHover={{ x: 4 }}
          >
            <motion.div
              animate={{ rotate: mostrarHistorico ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
            <span className="group-hover:underline">
              {mostrarHistorico ? "Ocultar histórico" : "Mostrar histórico"}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {historico.length}
            </span>
          </motion.button>

          <AnimatePresence>
            {mostrarHistorico && (
              <motion.ul 
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, staggerChildren: 0.1 }}
              >
                {historico.map((item, index) => renderCard(item, index))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      {perfilAbertoId && (
        <PerfilUsuarioModal
          usuarioId={perfilAbertoId}
          isOpen={!!perfilAbertoId}
          onClose={() => setPerfilAbertoId(null)}
        />
      )}      {viagemAbertaId && (
        <ViagemDetalhesModal
          viagemId={viagemAbertaId}
          open={!!viagemAbertaId}
          onClose={() => {
            setViagemAbertaId(null);
            setCarregandoViagemId(null);
          }}
          exibirAvisoConvite
          imagemViagem={imagensViagens[viagemAbertaId]}
        />
      )}
    </motion.div>
  );
};

export default CentralSolicitacoes;
