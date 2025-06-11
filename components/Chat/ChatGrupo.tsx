"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Loader2, 
  ArrowDown, 
  MessageCircle, 
  Users,
  VolumeX,
  Volume2,
  LogOut,
  AlertTriangle,
  Settings,
  UserPlus,
  UserMinus,
  Crown,
  Lock,
  Mail
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { MensagemGrupoDTO, NovaMensagemGrupoDTO } from "@/models/MensagemGrupoDTO";
import { 
  buscarMensagensGrupo, 
  enviarMensagemGrupo,
  marcarMensagensComoLidas,
  silenciarGrupo,
  sairDoGrupo,
  adicionarParticipanteGrupo,
  removerParticipanteGrupo,
  buscarParticipantesGrupo
} from "@/services/mensagemGrupoService";
import { toast } from "sonner";
import { getUserColor } from "@/utils/userColors";
import { getParticipantesDaViagem } from "@/services/viagemService";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";

interface ChatGrupoProps {
  grupoId: number;
  nomeGrupo: string;
  viagemId?: number;
  usuarioEhCriador?: boolean;
  onFechar?: () => void;
  onSairGrupo?: () => void;
  onRemovidoDoGrupo?: () => void;
}

export default function ChatGrupo({ 
  grupoId, 
  nomeGrupo, 
  viagemId,
  usuarioEhCriador = false,
  onFechar, 
  onSairGrupo,
  onRemovidoDoGrupo 
}: ChatGrupoProps) {
  const { usuario: usuarioLogado } = useAuth();
  const [mensagens, setMensagens] = useState<MensagemGrupoDTO[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mostrarScrollDown, setMostrarScrollDown] = useState(false);
  const [silenciado, setSilenciado] = useState(false);
  const [mostrarConfirmacaoSair, setMostrarConfirmacaoSair] = useState(false);
  const [mostrarAdministracao, setMostrarAdministracao] = useState(false);
  const [participantesViagem, setParticipantesViagem] = useState<UsuarioBuscaDTO[]>([]);
  const [participantesGrupo, setParticipantesGrupo] = useState<number[]>([]);
  const [carregandoParticipantes, setCarregandoParticipantes] = useState(false);
  const [erroAcesso, setErroAcesso] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<number | undefined>(undefined);

  // Carregar mensagens iniciais
  useEffect(() => {
    const carregarMensagens = async () => {
      try {
        setCarregando(true);
        const mensagensCarregadas = await buscarMensagensGrupo(grupoId);
        setMensagens(mensagensCarregadas);
        
        if (mensagensCarregadas.length > 0) {
          lastMessageIdRef.current = mensagensCarregadas[mensagensCarregadas.length - 1].id;
        }
        
        // Marcar mensagens como lidas
        await marcarMensagensComoLidas(grupoId);
      } catch (error: any) {
        console.error("Erro ao carregar mensagens do grupo:", error);
        
        // Verificar se é erro de acesso negado
        if (error?.response?.status === 404 || 
            (error?.response?.data && typeof error.response.data === 'string' && 
             error.response.data.includes("não participa desse grupo"))) {
          setErroAcesso("Você não faz mais parte deste grupo de chat. Solicite ao criador da viagem para adicioná-lo novamente.");
          // Notificar o componente pai que o usuário foi removido
          onRemovidoDoGrupo?.();
        } else if (error?.response?.status === 403) {
          setErroAcesso("Acesso negado ao grupo de chat.");
          onRemovidoDoGrupo?.();
        } else {
          toast.error("Erro ao carregar mensagens");
        }
      } finally {
        setCarregando(false);
      }
    };

    if (grupoId && usuarioLogado) {
      carregarMensagens();
    }
  }, [grupoId, usuarioLogado]);

  // Polling para novas mensagens
  useEffect(() => {
    if (!grupoId || !usuarioLogado) return;

    const buscarNovasMensagens = async () => {
      try {
        const novasMensagens = await buscarMensagensGrupo(grupoId, lastMessageIdRef.current);
        
        if (novasMensagens.length > 0) {
          setMensagens(prev => [...prev, ...novasMensagens]);
          lastMessageIdRef.current = novasMensagens[novasMensagens.length - 1].id;
          
          // Marcar como lidas se estiver visualizando
          await marcarMensagensComoLidas(grupoId);
        }
      } catch (error) {
        console.error("Erro ao buscar novas mensagens:", error);
      }
    };

    // Polling a cada 5 segundos
    const interval = setInterval(buscarNovasMensagens, 5000);
    return () => clearInterval(interval);
  }, [grupoId, usuarioLogado]);

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
      const dto: NovaMensagemGrupoDTO = {
        conteudo: conteudoMensagem
      };

      const mensagemEnviada = await enviarMensagemGrupo(grupoId, dto);
      setMensagens(prev => [...prev, mensagemEnviada]);
      lastMessageIdRef.current = mensagemEnviada.id;
      
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      
      // Verificar se é erro de acesso negado
      if (error?.response?.status === 404 || 
          (error?.response?.data && typeof error.response.data === 'string' && 
           error.response.data.includes("não participa desse grupo"))) {
        toast.error("Você não faz mais parte deste grupo. Solicite ao criador da viagem para adicioná-lo novamente.");
        setErroAcesso("Você não faz mais parte deste grupo de chat. Solicite ao criador da viagem para adicioná-lo novamente.");
        onRemovidoDoGrupo?.();
      } else if (error?.response?.status === 403) {
        toast.error("Acesso negado ao grupo de chat.");
        setErroAcesso("Acesso negado ao grupo de chat.");
        onRemovidoDoGrupo?.();
      } else {
        toast.error("Erro ao enviar mensagem");
        setNovaMensagem(conteudoMensagem); // Restaurar texto em caso de erro
      }
    } finally {
      setEnviando(false);
    }
  };

  const handleSilenciar = async () => {
    try {
      await silenciarGrupo(grupoId, !silenciado);
      setSilenciado(!silenciado);
      toast.success(silenciado ? "Grupo reativado" : "Grupo silenciado");
    } catch (error) {
      console.error("Erro ao silenciar/reativar grupo:", error);
      toast.error("Erro ao alterar configuração");
    }
  };

  const handleSairGrupo = async () => {
    try {
      await sairDoGrupo(grupoId);
      toast.success("Você saiu do grupo");
      onSairGrupo?.();
      onFechar?.();
    } catch (error) {
      console.error("Erro ao sair do grupo:", error);
      toast.error("Erro ao sair do grupo");
    }
  };

  const carregarParticipantesViagem = async () => {
    if (!viagemId) return;
    
    try {
      setCarregandoParticipantes(true);
      const participantes = await getParticipantesDaViagem(viagemId);
      setParticipantesViagem(participantes);
      
      // Tentar buscar participantes atuais do grupo
      try {
        const participantesDoGrupo = await buscarParticipantesGrupo(grupoId);
        setParticipantesGrupo(participantesDoGrupo);
        console.log("✅ Participantes do grupo carregados via API");
      } catch (error) {
        console.log("⚠️ Endpoint de participantes não disponível, assumindo todos estão no grupo");
        // Fallback: assume que todos os participantes da viagem estão no grupo
        setParticipantesGrupo(participantes.map(p => p.id));
      }
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
      toast.error("Erro ao carregar participantes");
    } finally {
      setCarregandoParticipantes(false);
    }
  };

  const handleAdicionarParticipante = async (usuarioId: number, nomeUsuario: string) => {
    try {
      await adicionarParticipanteGrupo(grupoId, usuarioId);
      toast.success(`${nomeUsuario} foi adicionado ao grupo!`);
      // Atualizar lista local
      setParticipantesGrupo(prev => [...prev, usuarioId]);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      toast.error("Erro ao adicionar participante ao grupo");
    }
  };

  const handleRemoverParticipante = async (usuarioId: number, nomeUsuario: string) => {
    try {
      await removerParticipanteGrupo(grupoId, usuarioId);
      toast.success(`${nomeUsuario} foi removido do grupo!`);
      // Atualizar lista local
      setParticipantesGrupo(prev => prev.filter(id => id !== usuarioId));
      
      // Se o usuário removido for o usuário atual, notificar o componente pai
      if (usuarioId === usuarioLogado?.id) {
        onRemovidoDoGrupo?.();
      }
    } catch (error) {
      console.error("Erro ao remover participante:", error);
      toast.error("Erro ao remover participante do grupo");
    }
  };

  // Verificar se um usuário está no grupo (baseado na lista de participantes)
  const usuarioEstaNoGrupo = (usuarioId: number) => {
    return participantesGrupo.includes(usuarioId);
  };

  const abrirAdministracao = () => {
    setMostrarAdministracao(true);
    carregarParticipantesViagem();
  };

  const formatarNome = (nomeCompleto: string) => {
    const partes = nomeCompleto.trim().split(" ");
    if (partes.length === 1) return partes[0];
    return `${partes[0]} ${partes[partes.length - 1]}`;
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
  }, {} as Record<string, MensagemGrupoDTO[]>);

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

  // Tela de erro quando usuário não tem acesso
  if (erroAcesso) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col h-full bg-gradient-to-br from-red-50 to-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6"
          >
            <Lock className="w-10 h-10 text-red-500" />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold text-red-700 mb-4"
          >
            Acesso Negado ao Chat
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-red-600 mb-6 max-w-md leading-relaxed"
          >
            {erroAcesso}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md"
          >
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Como solicitar acesso:</span>
            </div>
            <p className="text-xs text-blue-600">
              Entre em contato com o criador da viagem para ser adicionado novamente ao grupo de chat.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFechar}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Fechar
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
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
                <Users className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">{nomeGrupo}</h3>
              <p className="text-sm text-white/80">Grupo da viagem</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Botão Administrar Grupo - apenas para criador */}
            {usuarioEhCriador && viagemId && (
              <motion.button
                onClick={abrirAdministracao}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-yellow-500/30 transition-colors"
                title="Administrar grupo"
              >
                <Settings className="w-4 h-4 text-white" />
              </motion.button>
            )}

            {/* Botão Silenciar */}
            <motion.button
              onClick={handleSilenciar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              title={silenciado ? "Reativar grupo" : "Silenciar grupo"}
            >
              {silenciado ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </motion.button>

            {/* Botão Sair do Grupo */}
            <motion.button
              onClick={() => setMostrarConfirmacaoSair(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/30 transition-colors"
              title="Sair do grupo"
            >
              <LogOut className="w-4 h-4 text-white" />
            </motion.button>

            {/* Botão Fechar */}
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
              Bem-vindo ao chat da viagem!
            </h3>
            <p className="text-gray-500 max-w-sm">
              Este é o espaço para vocês conversarem e planejarem todos os detalhes da viagem juntos.
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
                          
                          {!isMinhaMsg && (
                            <div className="flex items-center gap-2 mb-2">
                              <p 
                                className="text-xs font-semibold"
                                style={{ color: getUserColor(mensagem.remetenteId) }}
                              >
                                {mensagem.remetenteNome}
                              </p>
                            </div>
                          )}
                          
                          <p className="text-sm leading-relaxed break-words">
                            {mensagem.conteudo}
                          </p>
                          
                          <div className={`flex items-center justify-end mt-2 text-xs ${
                            isMinhaMsg ? "text-white/70" : "text-gray-500"
                          }`}>
                            <span>{formatarHorario(mensagem.dataEnvio)}</span>
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
                placeholder="Digite sua mensagem para o grupo..."
                disabled={enviando}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none text-gray-900 placeholder-gray-500 disabled:opacity-50"
                style={{ 
                  minHeight: "48px",
                  maxHeight: "120px",
                  fontSize: "16px"
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

      {/* Modal de Confirmação para Sair */}
      <AnimatePresence>
        {mostrarConfirmacaoSair && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setMostrarConfirmacaoSair(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-center mb-2">
                Sair do Grupo
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Tem certeza que deseja sair do grupo? Você não poderá mais enviar ou receber mensagens.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setMostrarConfirmacaoSair(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSairGrupo}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Sair
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Administração do Grupo */}
      <AnimatePresence>
        {mostrarAdministracao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto"
            onClick={() => setMostrarAdministracao(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md mx-auto my-4 shadow-2xl overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header fixo */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <span className="truncate">Administrar Grupo</span>
                  </h3>
                  <button
                    onClick={() => setMostrarAdministracao(false)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <span className="text-gray-500 text-lg">×</span>
                  </button>
                </div>
              </div>

              {/* Conteúdo scrollável */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {carregandoParticipantes ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full"
                    />
                  </div>
                ) : (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">
                      📋 Administração do Grupo
                    </p>
                    <p className="text-xs text-blue-600 leading-relaxed">
                      Gerencie quem participa do chat.
                      {participantesGrupo.length === participantesViagem.length 
                        ? " Todos estão no grupo." 
                        : ` ${participantesGrupo.length}/${participantesViagem.length} no grupo.`
                      }
                    </p>
                  </div>
                  
                  {participantesViagem.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nenhum participante na viagem</p>
                  ) : (
                    participantesViagem.map((participante) => {
                      const estaNoGrupo = usuarioEstaNoGrupo(participante.id);
                      const ehOMesmoCriador = participante.criador;
                      
                      return (
                        <div
                          key={participante.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {participante.fotoPerfil ? (
                                <img
                                  src={participante.fotoPerfil}
                                  alt={formatarNome(participante.nome)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-800 flex items-center gap-1 text-sm sm:text-base truncate">
                                <span className="truncate">{formatarNome(participante.nome)}</span>
                                {ehOMesmoCriador && (
                                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {estaNoGrupo ? "✅ No chat" : "❌ Removido"}
                              </p>
                            </div>
                          </div>

                          {!ehOMesmoCriador && (
                            <div>
                              {estaNoGrupo ? (
                                <motion.button
                                  onClick={() => handleRemoverParticipante(participante.id, formatarNome(participante.nome))}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm flex-shrink-0"
                                  title="Remover do chat do grupo"
                                >
                                  <UserMinus className="w-3 h-3" />
                                  <span className="hidden sm:inline">Remover</span>
                                </motion.button>
                              ) : (
                                <motion.button
                                  onClick={() => handleAdicionarParticipante(participante.id, formatarNome(participante.nome))}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-xs sm:text-sm flex-shrink-0"
                                  title="Adicionar de volta ao chat do grupo"
                                >
                                  <UserPlus className="w-3 h-3" />
                                  <span className="hidden sm:inline">Readicionar</span>
                                </motion.button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                )}
              </div>

              {/* Footer fixo */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-6">
                <button
                  onClick={() => setMostrarAdministracao(false)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efeitos decorativos */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
    </motion.div>
  );
} 