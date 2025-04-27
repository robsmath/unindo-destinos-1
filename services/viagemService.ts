import api from "./api";
import { ViagemDTO } from "@/models/ViagemDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const cadastrarViagem = async (dados: ViagemDTO): Promise<ViagemDTO> => {
  const response = await api.post<ApiResponse<ViagemDTO>>("/viagens", dados);
  return response.data.data;
};


export const editarViagem = async (id: number, dados: ViagemDTO) => {
  return api.put(`/viagens/${id}`, dados);
};

export const getMinhasViagens = async (usuarioId: number): Promise<ViagemDTO[]> => {
  const response = await api.get<ApiResponse<ViagemDTO[]>>(`/viagens/usuario/${usuarioId}`);
  return response.data.data;
};

export const deletarViagem = async (id: number) => {
  return api.delete(`/viagens/${id}`);
};

export const getViagemById = async (id: number): Promise<ViagemDTO> => {
  const response = await api.get<ApiResponse<ViagemDTO>>(`/viagens/${id}`);
  return response.data.data;
};

