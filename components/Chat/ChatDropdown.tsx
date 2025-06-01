"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, User, X } from 'lucide-react';
import { buscarRemetentesComMensagensNaoLidas, marcarConversaComoVisualizada } from '@/services/mensagemService';
import { RemetenteComMensagensDTO } from '@/models/RemetenteComMensagensDTO';
import ChatPrivado from './ChatPrivado';

interface ChatDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  hasUnreadMessages: boolean;
}

export default function ChatDropdown({ isOpen, onClose, onToggle, hasUnreadMessages }: ChatDropdownProps) {
  const [remetentes, setRemetentes] = useState<RemetenteComMensagensDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<RemetenteComMensagensDTO | null>(null);
  useEffect(() => {
    if (isOpen) {
      fetchRemetentes();
      
      const interval = setInterval(() => {
        fetchRemetentes();
      }, 5000); 
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchRemetentes = async () => {
    try {
      setLoading(true);
      const data = await buscarRemetentesComMensagensNaoLidas();
      setRemetentes(data);
    } catch (error) {
      console.error("Erro ao buscar remetentes:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenChat = async (remetente: RemetenteComMensagensDTO) => {
    setUsuarioSelecionado(remetente);
    setChatAberto(true);
    onClose();
    
    try {
      await marcarConversaComoVisualizada(remetente.usuarioId);
      await fetchRemetentes();
    } catch (error) {
      console.error("Erro ao marcar conversa como visualizada:", error);
    }
  };
  const handleCloseChat = async () => {
    setChatAberto(false);
    setUsuarioSelecionado(null);
    await fetchRemetentes();
  };

  const formatarNome = (nome: string) => {
    const partes = nome.split(' ');
    return partes.length > 1 ? `${partes[0]} ${partes[partes.length - 1]}` : partes[0];
  };

  return (
    <>
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-primary/10 transition-all duration-300 group border border-gray-200/50"
        title="Mensagens"
      >
        <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
        {hasUnreadMessages && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-80 max-h-96 bg-white/95 backdrop-blur-lg shadow-2xl ring-1 ring-black/5 rounded-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-orange-500/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Mensagens
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-500">Carregando...</p>
                </div>
              ) : remetentes.length === 0 ? (
                <div className="p-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <MessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Nenhuma mensagem</p>
                    <p className="text-xs text-gray-500">Você não tem mensagens não lidas</p>
                  </motion.div>
                </div>
              ) : (
                <div className="py-2">                  {remetentes.map((remetente, index) => (
                    <motion.button
                      key={remetente.usuarioId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleOpenChat(remetente)}
                      className="w-full p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {remetente.fotoPerfil ? (
                            <img
                              src={remetente.fotoPerfil}
                              alt={remetente.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        {remetente.quantidadeMensagensNaoLidas > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {remetente.quantidadeMensagensNaoLidas > 9 ? '9+' : remetente.quantidadeMensagensNaoLidas}
                          </span>
                        )}
                      </div>                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-gray-800 truncate group-hover:text-primary transition-colors">
                          {formatarNome(remetente.nome)}
                        </p>
                        {remetente.quantidadeMensagensNaoLidas > 0 && (
                          <p className="text-xs text-gray-500">
                            {remetente.quantidadeMensagensNaoLidas} mensagem{remetente.quantidadeMensagensNaoLidas !== 1 ? 's' : ''} não lida{remetente.quantidadeMensagensNaoLidas !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>      
      <AnimatePresence>
        {chatAberto && usuarioSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleCloseChat}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-md h-[600px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mx-auto"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', margin: 'auto' }}
            ><div className="h-full">
                <ChatPrivado 
                  usuarioId={usuarioSelecionado.usuarioId}
                  onFechar={handleCloseChat}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
