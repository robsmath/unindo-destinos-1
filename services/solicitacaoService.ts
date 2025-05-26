import api from "./api";
import { SolicitacaoParticipacaoDTO } from "@/models/SolicitacaoParticipacaoDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

export const enviarConvite = async (
  viagemId: number,
  usuarioId: number,
  mensagem?: string
): Promise<SolicitacaoParticipacaoDTO> => {
  const response = await api.post<ApiResponse<SolicitacaoParticipacaoDTO>>(
    "/solicitacoes/convites", 
    null,
    { params: { viagemId, usuarioId, mensagem } }
  );
  return response.data.data;
};

export const solicitarParticipacao = async (
  viagemId: number,
  mensagem?: string
): Promise<SolicitacaoParticipacaoDTO> => {
  const response = await api.post<ApiResponse<SolicitacaoParticipacaoDTO>>(
    `/solicitacoes/participar/${viagemId}`,
    null,
    { params: { mensagem } }
  );
  return response.data.data;
};

export const getMinhasSolicitacoes = async (): Promise<SolicitacaoParticipacaoDTO[]> => {
  const response = await api.get<ApiResponse<SolicitacaoParticipacaoDTO[]>>(
    "/solicitacoes/minhas" 
  );
  return response.data.data;
};

export const aprovarSolicitacao = async (
  solicitacaoId: number
): Promise<void> => {
  await api.post<ApiResponse<any>>(`/solicitacoes/${solicitacaoId}/aprovar`);
};

export const recusarSolicitacao = async (
  solicitacaoId: number
): Promise<void> => {
  await api.post<ApiResponse<any>>(`/solicitacoes/${solicitacaoId}/recusar`);
};

export const cancelarSolicitacao = async (
  solicitacaoId: number
): Promise<void> => {
  await api.delete<ApiResponse<any>>(`/solicitacoes/${solicitacaoId}`);
};
