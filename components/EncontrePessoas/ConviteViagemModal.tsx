"use client";

import { Fragment, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MinhasViagensDTO } from "@/models/MinhasViagensDTO";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { Loader2, X, Send, Calendar, MapPin, MessageCircle, User } from "lucide-react";
import { toast } from "sonner";
import { enviarConvite } from "@/services/solicitacaoService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuario: UsuarioBuscaDTO;
  viagens: MinhasViagensDTO[];
}

const formatarData = (dataISO: string) => {
  if (!dataISO) return "Data inválida";
  const data = new Date(dataISO);
  return !isNaN(data.getTime()) ? data.toLocaleDateString("pt-BR") : "Data inválida";
};

export default function ConviteViagemModal({
  isOpen,
  onClose,
  usuario,
  viagens,
}: Props) {
  const [viagemSelecionadaId, setViagemSelecionadaId] = useState<string>("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const viagensFiltradas = useMemo(
    () =>
      viagens.filter(
        (v) =>
          v.criador && // 🔥 Só as que você é criador
          ["RASCUNHO", "PENDENTE", "CONFIRMADA"].includes(v.viagem.status) && // 🔥 E com status permitido
          (!v.viagem.numeroMaximoParticipantes || v.quantidadeParticipantes < v.viagem.numeroMaximoParticipantes) // 🔥 E que não estão lotadas
      ),
    [viagens]
  );

  const handleEnviarConvite = async () => {
    if (!viagemSelecionadaId) {
      toast.warning("Selecione uma viagem antes de enviar o convite.");
      return;
    }

    try {
      setCarregando(true);
      await enviarConvite(Number(viagemSelecionadaId), usuario.id, mensagem || undefined);
      toast.success("Convite enviado com sucesso!");
      onClose();
      // Reset form
      setViagemSelecionadaId("");
      setMensagem("");
    } catch (err: any) {
      const mensagemErro =
        err?.response?.data?.message || "Erro ao enviar convite. Tente novamente.";
      toast.error(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  const handleClose = () => {
    if (!carregando) {
      setViagemSelecionadaId("");
      setMensagem("");
      onClose();
    }
  };

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
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
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
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  {usuario.fotoPerfil ? (
                    <img
                      src={usuario.fotoPerfil}
                      alt="Foto do usuário"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Convidar para viagem</h2>
                  <p className="text-white/80">{usuario.nome}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Trip Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Selecionar viagem
                </label>
                <div className="relative">
                  <select
                    value={viagemSelecionadaId}
                    onChange={(e) => setViagemSelecionadaId(e.target.value)}
                    className="w-full p-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 appearance-none cursor-pointer text-gray-700"
                    disabled={carregando}
                  >
                    <option value="">Escolha uma viagem...</option>
                    {viagensFiltradas.length === 0 && (
                      <option disabled value="">
                        Nenhuma viagem disponível para convites
                      </option>
                    )}
                    {viagensFiltradas.map((v) => (
                      <option key={v.viagem.id} value={v.viagem.id}>
                        {v.viagem.destino} ({formatarData(v.viagem.dataInicio)} - {formatarData(v.viagem.dataFim)})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Trip Details Preview */}
                {viagemSelecionadaId && (
                  <motion.div
                    className="bg-primary/5 border border-primary/20 rounded-xl p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      const viagemSelecionada = viagensFiltradas.find(v => v.viagem.id.toString() === viagemSelecionadaId);
                      if (!viagemSelecionada) return null;
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium">{viagemSelecionada.viagem.destino}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>
                              {formatarData(viagemSelecionada.viagem.dataInicio)} até {formatarData(viagemSelecionada.viagem.dataFim)}
                            </span>
                          </div>
                          {viagemSelecionada.viagem.numeroMaximoParticipantes && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4 text-primary" />
                              <span>
                                {viagemSelecionada.quantidadeParticipantes}/{viagemSelecionada.viagem.numeroMaximoParticipantes} participantes
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Mensagem personalizada (opcional)
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva uma mensagem para acompanhar o convite..."
                  className="w-full p-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none h-24 text-gray-700"
                  maxLength={500}
                  disabled={carregando}
                />
                <div className="text-right text-xs text-gray-500">
                  {mensagem.length}/500
                </div>
              </div>

              {/* Actions */}
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
                  onClick={handleEnviarConvite}
                  disabled={carregando || !viagemSelecionadaId}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    carregando || !viagemSelecionadaId ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                  }`}
                  whileHover={!carregando && viagemSelecionadaId ? { scale: 1.02 } : {}}
                  whileTap={!carregando && viagemSelecionadaId ? { scale: 0.98 } : {}}
                >
                  {carregando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Convite
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
