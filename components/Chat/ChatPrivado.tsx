"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, ArrowDown, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { MensagemDTO } from "@/models/MensagemDTO";
import { NovaMensagemDTO } from "@/models/NovaMensagemDTO";
import { buscarConversa, enviarMensagem } from "@/services/mensagemService";
import { getUsuarioById } from "@/services/userService";
import { toast } from "sonner";

interface ChatPrivadoProps {
  usuarioId: number;
  onFechar?: () => void;
}

export default function ChatPrivado({ usuarioId, onFechar }: ChatPrivadoProps) {
  const { usuario: usuarioLogado } = useAuth();
  const [mensagens, setMensagens] = useState<MensagemDTO[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [destinatario, setDestinatario] = useState<{ nome: string; fotoPerfil?: string } | null>(null);
  const [mostrarScrollDown, setMostrarScrollDown] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        
        // Carregar dados do destinatário
        const dadosDestinatario = await getUsuarioById(usuarioId);
        const nomeFormatado = dadosDestinatario.nome.split(' ');
        const primeiroUltimoNome = nomeFormatado.length > 1 
          ? `${nomeFormatado[0]} ${nomeFormatado[nomeFormatado.length - 1]}`
          : nomeFormatado[0];
          
        setDestinatario({
          nome: primeiroUltimoNome,
          fotoPerfil: dadosDestinatario.fotoPerfil
        });

        // Carregar conversa
        const conversaData = await buscarConversa(usuarioId);
        setMensagens(conversaData);
        
      } catch (error) {
        console.error("Erro ao carregar dados do chat:", error);
        toast.error("Erro ao carregar conversa");
      } finally {
        setCarregando(false);
      }
    };

    if (usuarioId && usuarioLogado) {
      carregarDados();
    }
  }, [usuarioId, usuarioLogado]);

  // Atualização automática da conversa (polling)
  useEffect(() => {
    if (!usuarioId || !usuarioLogado) return;

    const atualizarConversa = async () => {
      try {
        const conversaAtualizada = await buscarConversa(usuarioId);
        setMensagens(conversaAtualizada);
      } catch (error) {
        console.error("Erro ao atualizar conversa:", error);
      }
    };

    // Polling a cada 5 segundos
    const interval = setInterval(atualizarConversa, 5000);
    return () => clearInterval(interval);
  }, [usuarioId, usuarioLogado]);

  // Scroll automático para última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  // Detectar scroll para mostrar botão "voltar ao final"
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setMostrarScrollDown(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaMensagem.trim() || enviando) return;
    
    const conteudoMensagem = novaMensagem.trim();
    setNovaMensagem("");
    setEnviando(true);

    try {
      const dto: NovaMensagemDTO = {
        destinatarioId: usuarioId,
        conteudo: conteudoMensagem
      };

      const mensagemEnviada = await enviarMensagem(dto);
      setMensagens(prev => [...prev, mensagemEnviada]);
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
      setNovaMensagem(conteudoMensagem); // Restaurar texto em caso de erro
    } finally {
      setEnviando(false);
    }
  };

  const formatarHorario = (dataEnvio: string) => {
    return new Date(dataEnvio).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatarData = (dataEnvio: string) => {
    const data = new Date(dataEnvio);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    if (data.toDateString() === hoje.toDateString()) {
      return "Hoje";
    } else if (data.toDateString() === ontem.toDateString()) {
      return "Ontem";
    } else {
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
  };

  // Agrupar mensagens por data
  const mensagensAgrupadas = mensagens.reduce((grupos, mensagem) => {
    const data = formatarData(mensagem.dataEnvio);
    if (!grupos[data]) {
      grupos[data] = [];
    }
    grupos[data].push(mensagem);
    return grupos;
  }, {} as Record<string, MensagemDTO[]>);
  if (carregando) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-center h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="p-4 rounded-full bg-gradient-to-r from-primary to-orange-500"
          >
            <Loader2 className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-xl"
    >
      {/* Header do Chat */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary to-orange-500 px-6 py-4 text-white relative overflow-hidden"
      >
        {/* Background decorativo */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                {destinatario?.fotoPerfil ? (
                  <img
                    src={destinatario.fotoPerfil}
                    alt={destinatario.nome}
                    className="w-full h-full rounded-full object-cover"
                  />                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
            </motion.div>
              <div>
              <h3 className="font-semibold text-lg">{destinatario?.nome}</h3>
            </div>
          </div>

          {onFechar && (
            <motion.button
              onClick={onFechar}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-lg">×</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Área de Mensagens */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
      >
        {Object.keys(mensagensAgrupadas).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="p-4 rounded-full bg-gradient-to-r from-primary/10 to-orange-500/10 mb-4"
            >
              <MessageCircle className="w-12 h-12 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Inicie uma conversa
            </h3>
            <p className="text-gray-500 max-w-sm">
              Envie sua primeira mensagem para {destinatario?.nome} e comece a planejar uma viagem incrível juntos!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {Object.entries(mensagensAgrupadas).map(([data, mensagensData]) => (
              <motion.div
                key={data}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {/* Separador de Data */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center my-4"
                >
                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                    {data}
                  </span>
                </motion.div>

                {/* Mensagens do dia */}
                {mensagensData.map((mensagem, index) => {
                  const isMinhaMsg = mensagem.remetenteId === usuarioLogado?.id;
                  
                  return (
                    <motion.div
                      key={mensagem.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${isMinhaMsg ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] ${isMinhaMsg ? "order-2" : "order-1"}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                            isMinhaMsg
                              ? "bg-gradient-to-r from-primary to-orange-500 text-white ml-auto"
                              : "bg-white text-gray-800 border border-gray-100"
                          }`}
                        >
                          {/* Bolha de fala */}
                          <div
                            className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                              isMinhaMsg
                                ? "bg-gradient-to-r from-primary to-orange-500 -right-1"
                                : "bg-white border-r border-b border-gray-100 -left-1"
                            }`}
                          />
                          
                          <p className="text-sm leading-relaxed break-words">
                            {mensagem.conteudo}
                          </p>
                          
                          <div className={`flex items-center justify-end mt-2 text-xs ${
                            isMinhaMsg ? "text-white/70" : "text-gray-500"
                          }`}>
                            <span>{formatarHorario(mensagem.dataEnvio)}</span>
                            {isMinhaMsg && mensagem.visualizada && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-2 text-green-200"
                              >
                                ✓✓
                              </motion.span>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Botão Scroll to Bottom */}
      <AnimatePresence>
        {mostrarScrollDown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 right-6 w-10 h-10 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input de Nova Mensagem */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100"
      >
        <form onSubmit={handleEnviarMensagem} className="relative">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <motion.textarea
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder={`Mensagem para ${destinatario?.nome}...`}
                disabled={enviando}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none text-gray-900 placeholder-gray-500 disabled:opacity-50"
                style={{ 
                  minHeight: "48px",
                  maxHeight: "120px",
                  fontSize: "16px" // Previne zoom no iOS
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEnviarMensagem(e);
                  }
                }}
              />
              
              {/* Contador de caracteres */}
              {novaMensagem.length > 200 && (
                <span className={`absolute bottom-1 right-3 text-xs ${
                  novaMensagem.length > 500 ? "text-red-500" : "text-gray-400"
                }`}>
                  {novaMensagem.length}/500
                </span>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={!novaMensagem.trim() || enviando}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {enviando ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Efeitos decorativos */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
    </motion.div>
  );
}
