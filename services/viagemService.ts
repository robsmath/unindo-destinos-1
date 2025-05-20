import api from "./api";
import { ViagemDTO } from "@/models/ViagemDTO";
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

export const editarViagem = async (id: number, dados: ViagemDTO): Promise<void> => {
  await api.put(`/viagens/${id}`, dados);
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

export const confirmarViagem = async (id: number) => {
  return api.put(`/viagens/${id}/status`, null, { params: { novoStatus: "CONFIRMADA" } });
};

export const cancelarViagem = async (id: number) => {
  return api.put(`/viagens/${id}/status`, null, { params: { novoStatus: "CANCELADA" } });
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
