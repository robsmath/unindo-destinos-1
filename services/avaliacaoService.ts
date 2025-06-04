import api from './api';
import { AvaliacaoDTO } from '@/models/AvaliacaoDTO';
import { AvaliacaoRequestDTO } from '@/models/AvaliacaoRequestDTO';

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const criarAvaliacao = async (data: AvaliacaoRequestDTO): Promise<AvaliacaoDTO> => {
  const response = await api.post<ApiResponse<AvaliacaoDTO>>('/avaliacoes/avaliar', data);
  return response.data.data;
};

export const buscarAvaliacoesPorUsuario = async (usuarioId: number): Promise<AvaliacaoDTO[]> => {
  const response = await api.get<ApiResponse<AvaliacaoDTO[]>>(`/avaliacoes/usuarios/${usuarioId}/recebidas`);
  return response.data.data;
};

export const buscarAvaliacaoPorId = async (avaliacaoId: number): Promise<AvaliacaoDTO> => {
  const response = await api.get<ApiResponse<AvaliacaoDTO>>(`/avaliacoes/${avaliacaoId}`);
  return response.data.data;
};
