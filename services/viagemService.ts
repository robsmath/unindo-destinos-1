import api from "./api";
import { ViagemDTO } from "@/models/ViagemDTO";
import { ViagemBuscaDTO } from "@/models/ViagemBuscaDTO";
import { ViagemFiltroDTO } from "@/models/ViagemFiltroDTO";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { MinhasViagensDTO } from "@/models/MinhasViagensDTO";

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

export const editarViagem = async (id: number, dados: ViagemDTO): Promise<ViagemDTO> => {
  const response = await api.put<ApiResponse<ViagemDTO>>(`/viagens/${id}`, dados);
  return response.data.data;
};

export const getMinhasViagens = async (): Promise<MinhasViagensDTO[]> => {
  const response = await api.get<ApiResponse<MinhasViagensDTO[]>>("/viagens/minhas");
  return response.data.data;
};

export const deletarViagem = async (id: number): Promise<void> => {
  await api.delete(`/viagens/${id}`);
};

export const getViagemById = async (id: number): Promise<ViagemDTO> => {
  const response = await api.get<ApiResponse<ViagemDTO>>(`/viagens/${id}`);
  return response.data.data;
};

export const getParticipantesDaViagem = async (
  viagemId: number
): Promise<UsuarioBuscaDTO[]> => {
  const response = await api.get<ApiResponse<UsuarioBuscaDTO[]>>(
    `/viagens/${viagemId}/participantes`
  );
  return response.data.data;
};

export const removerParticipanteDaViagem = async (
  viagemId: number,
  usuarioId: number
): Promise<void> => {
  await api.delete(`/viagens/${viagemId}/participantes`, {
    params: { usuarioId },
  });
};

export const sairDaViagem = async (viagemId: number): Promise<void> => {
  await api.delete(`/viagens/${viagemId}/sair`);
};

export const buscarViagens = async (
  filtros: ViagemFiltroDTO
): Promise<ViagemBuscaDTO[]> => {
  const response = await api.post<ApiResponse<ViagemBuscaDTO[]>>(
    "/viagens/encontrar",
    filtros
  );
  return response.data.data;
};