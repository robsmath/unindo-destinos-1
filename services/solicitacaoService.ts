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
  usuarioId: number
): Promise<void> => {
  await api.post<ApiResponse<any>>(
    "/solicitacoes/convites/enviar",
    null,
    { params: { viagemId, usuarioId } }
  );
};

export const getMinhasSolicitacoes = async (): Promise<SolicitacaoParticipacaoDTO[]> => {
  const response = await api.get<ApiResponse<SolicitacaoParticipacaoDTO[]>>("/solicitacoes/me");
  return response.data.data;
};

export const aprovarSolicitacao = async (
  solicitacaoId: number
): Promise<void> => {
  await api.post<ApiResponse<any>>(
    "/solicitacoes/aprovar",
    null,
    { params: { solicitacaoId } }
  );
};

export const recusarSolicitacao = async (
  solicitacaoId: number
): Promise<void> => {
  await api.delete<ApiResponse<any>>(`/solicitacoes/${solicitacaoId}/recusar`);
};

export const cancelarSolicitacao = async (
  solicitacaoId: number
): Promise<void> => {
  await api.delete<ApiResponse<any>>(`/solicitacoes/${solicitacaoId}`);
};
