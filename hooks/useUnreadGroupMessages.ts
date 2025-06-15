import { useState, useEffect } from 'react';
import { buscarGruposComMensagensNaoLidas } from '@/services/mensagemGrupoService';
import { GrupoComMensagensDTO } from '@/models/GrupoComMensagensDTO';

export const useUnreadGroupMessages = (pollingInterval = 30000) => {
  const [grupos, setGrupos] = useState<GrupoComMensagensDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGruposNaoLidos = async () => {
    try {
      setLoading(true);
      const gruposData = await buscarGruposComMensagensNaoLidas();
      setGrupos(gruposData);
    } catch (err) {
      console.error('Erro ao buscar grupos com mensagens não lidas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGruposNaoLidos();
    const interval = setInterval(fetchGruposNaoLidos, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval]);

  const hasUnreadGroupMessages = grupos.length > 0;
  const totalUnreadGroupCount = grupos.reduce((total, grupo) => total + grupo.quantidadeMensagensNaoLidas, 0);

  const getUnreadCountForGroup = (grupoId: number) => {
    const grupo = grupos.find(g => g.grupoId === grupoId);
    return grupo?.quantidadeMensagensNaoLidas || 0;
  };

  const refreshGroups = () => {
    fetchGruposNaoLidos();
  };

  return {
    grupos,
    hasUnreadGroupMessages,
    totalUnreadGroupCount,
    getUnreadCountForGroup,
    loading,
    refreshGroups
  };
}; 