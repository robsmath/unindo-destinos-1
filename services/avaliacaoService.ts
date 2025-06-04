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
  const response = await api.post<ApiResponse<AvaliacaoDTO>>('/avaliacoes', data);
  return response.data.data;
};

export const buscarAvaliacoes = async (viagemId: number): Promise<AvaliacaoDTO[]> => {
  const response = await api.get<ApiResponse<AvaliacaoDTO[]>>(`/avaliacoes/viagem/${viagemId}`);
  return response.data.data;
};

export const atualizarAvaliacao = async (avaliacaoId: number, data: AvaliacaoRequestDTO): Promise<AvaliacaoDTO> => {
  const response = await api.put<ApiResponse<AvaliacaoDTO>>(`/avaliacoes/${avaliacaoId}`, data);
  return response.data.data;
};

export const excluirAvaliacao = async (avaliacaoId: number): Promise<void> => {
  await api.delete(`/avaliacoes/${avaliacaoId}`);
};
