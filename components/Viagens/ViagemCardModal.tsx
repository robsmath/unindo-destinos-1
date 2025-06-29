"use client";

import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ViagemBuscaDTO } from "@/models/ViagemBuscaDTO";
import { 
  X, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock, 
  Send, 
  MessageCircle,
  Plane,
  User,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { solicitarParticipacao } from "@/services/solicitacaoService";
import { formatarDataViagem, formatarPeriodoViagem } from "@/utils/dateUtils";

interface Props {
  viagem: ViagemBuscaDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatarNomeCompleto = (nomeCompleto: string) => {
  if (!nomeCompleto) return "Nome não informado";
  const nomes = nomeCompleto.trim().split(" ");
  if (nomes.length === 1) return nomes[0];
  return `${nomes[0]} ${nomes[nomes.length - 1]}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDENTE":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CONFIRMADA":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "EM_ANDAMENTO":
      return "bg-green-100 text-green-800 border-green-200";
    case "CONCLUIDA":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "CANCELADA":
      return "bg-red-100 text-red-800 border-red-200";
    case "RASCUNHO":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getEstiloIcon = (estilo: string) => {
  switch (estilo) {
    case "AVENTURA":
      return "🏔️";
    case "CULTURA":
      return "🏛️";
    case "FESTA":
      return "🎉";
    case "RELAXAMENTO":
      return "🏖️";
    case "GASTRONOMIA":
      return "🍽️";
    case "ECOTURISMO":
      return "🌿";
    case "NEGOCIOS":
      return "💼";
    case "ROMANTICA":
      return "💕";
    case "RELIGIOSA":
      return "⛪";
    case "COMPRAS":
      return "🛍️";
    case "PRAIA":
      return "🏝️";
    case "HISTORICA":
      return "🏰";
    case "TECNOLOGIA":
      return "💻";
    case "NAO_TENHO_PREFERENCIA":
      return "✈️";
    default:
      return "✈️";
  }
};

export default function ViagemCardModal({ viagem, isOpen, onClose }: Props) {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSolicitarParticipacao = async () => {
    if (!viagem) return;

    try {
      setCarregando(true);
      await solicitarParticipacao(viagem.id, mensagem || undefined);
      toast.success("Solicitação enviada com sucesso!");
      onClose();
      setMensagem("");
    } catch (err: any) {
      const mensagemErro =
        err?.response?.data?.message || "Erro ao enviar solicitação. Tente novamente.";
      toast.error(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  const handleClose = () => {
    if (!carregando) {
      setMensagem("");
      onClose();
    }
  };

  if (!viagem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative bg-gradient-to-r from-primary to-orange-500 text-white p-6">
              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={carregando}
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  {getEstiloIcon(viagem.estiloViagem)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{viagem.destino}</h2>
                  <p className="text-white/80">
                    {viagem.estiloViagem} • {viagem.categoriaViagem === "NACIONAL" ? "Nacional" : "Internacional"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Período</p>
                      <p className="font-semibold text-gray-800">
                        {formatarPeriodoViagem(viagem.dataInicio, viagem.dataFim)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Valor Médio</p>
                      <p className="font-semibold text-gray-800">
                        {viagem.valorMedioViagem 
                          ? `R$ ${viagem.valorMedioViagem.toLocaleString("pt-BR")}` 
                          : "Não informado"
                        }
                      </p>
                    </div>
                  </div>
                </div>                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Participantes</p>
                      <p className="font-semibold text-gray-800">
                        {viagem.quantidadeParticipantes} de {viagem.numeroMaximoParticipantes || "∞"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Criador</p>
                      <p className="font-semibold text-gray-800">{formatarNomeCompleto(viagem.criadorNome)}</p>
                    </div>
                  </div>
                </div>              </div>
              {viagem.descricao && (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FileText className="w-5 h-5 text-primary" />
                    Descrição
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {viagem.descricao}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(viagem.status)}`}>
                  <Clock className="w-4 h-4" />
                  {viagem.status}
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Mensagem para o criador (opcional)
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva uma mensagem para acompanhar sua solicitação..."
                  className="w-full p-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none h-24 text-gray-700"
                  maxLength={500}
                  disabled={carregando}
                />
                <div className="text-right text-xs text-gray-500">
                  {mensagem.length}/500
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={carregando}
                >
                  Cancelar
                </motion.button>
                  <motion.button
                  onClick={handleSolicitarParticipacao}
                  disabled={carregando || !["PENDENTE", "CONFIRMADA"].includes(viagem.status)}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    carregando || !["PENDENTE", "CONFIRMADA"].includes(viagem.status) ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                  }`}
                  whileHover={!carregando && ["PENDENTE", "CONFIRMADA"].includes(viagem.status) ? { scale: 1.02 } : {}}
                  whileTap={!carregando && ["PENDENTE", "CONFIRMADA"].includes(viagem.status) ? { scale: 0.98 } : {}}
                >
                  {carregando ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Enviando...
                    </>
                  ) : !["PENDENTE", "CONFIRMADA"].includes(viagem.status) ? (
                    <>
                      <X className="w-4 h-4" />
                      Viagem não disponível
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Solicitar Participação
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
