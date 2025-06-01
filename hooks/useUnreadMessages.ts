import { useState, useEffect } from 'react';
import { buscarMensagensNaoLidas, marcarConversaComoVisualizada } from '@/services/mensagemService';
import { MensagemDTO } from '@/models/MensagemDTO';

export const useUnreadMessages = (pollingInterval = 10000) => {
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState<MensagemDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMensagensNaoLidas = async () => {
    try {
      const mensagens = await buscarMensagensNaoLidas();
      setMensagensNaoLidas(mensagens);
    } catch (err) {
      console.error("Erro ao buscar mensagens não lidas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch inicial
    fetchMensagensNaoLidas();
    
    // Polling
    const interval = setInterval(fetchMensagensNaoLidas, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval]);

  const getUnreadCountForUser = (userId: number) => {
    return mensagensNaoLidas.filter(msg => msg.remetenteId === userId).length;
  };

  const markConversationAsRead = async (userId: number) => {
    try {
      await marcarConversaComoVisualizada(userId);
      // Remove mensagens não lidas deste usuário
      setMensagensNaoLidas(prev => prev.filter(msg => msg.remetenteId !== userId));
    } catch (err) {
      console.error("Erro ao marcar conversa como visualizada:", err);
    }
  };

  const hasUnreadMessages = mensagensNaoLidas.length > 0;
  const totalUnreadCount = mensagensNaoLidas.length;

  return {
    mensagensNaoLidas,
    hasUnreadMessages,
    totalUnreadCount,
    getUnreadCountForUser,
    markConversationAsRead,
    loading,
    refetch: fetchMensagensNaoLidas
  };
};
