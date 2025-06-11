import api from "./api";
import { MensagemGrupoDTO, NovaMensagemGrupoDTO } from "@/models/MensagemGrupoDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

const BASE_URL = "/grupos";

export const buscarMensagensGrupo = async (
  grupoId: number, 
  lastMessageId?: number
): Promise<MensagemGrupoDTO[]> => {
  const params = lastMessageId ? `?lastMessageId=${lastMessageId}` : '';
  const response = await api.get<ApiResponse<MensagemGrupoDTO[]>>(
    `${BASE_URL}/${grupoId}/mensagens${params}`
  );
  return response.data.data;
};

export const enviarMensagemGrupo = async (
  grupoId: number, 
  novaMensagem: NovaMensagemGrupoDTO
): Promise<MensagemGrupoDTO> => {
  const response = await api.post<ApiResponse<MensagemGrupoDTO>>(
    `${BASE_URL}/${grupoId}/mensagens`, 
    novaMensagem
  );
  return response.data.data;
};

export const marcarMensagensComoLidas = async (grupoId: number): Promise<void> => {
  await api.post(`${BASE_URL}/${grupoId}/marcar-lidas`);
};

export const silenciarGrupo = async (grupoId: number, silenciar: boolean): Promise<void> => {
  await api.post(`${BASE_URL}/${grupoId}/silenciar?silenciar=${silenciar}`);
};

export const sairDoGrupo = async (grupoId: number): Promise<void> => {
  await api.post(`${BASE_URL}/${grupoId}/sair`);
};

export const buscarGruposComMensagensNaoLidas = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>(`${BASE_URL}/nao-lidas`);
  return response.data.data;
};

export const buscarParticipantesGrupo = async (grupoId: number): Promise<number[]> => {
  const response = await api.get<ApiResponse<number[]>>(`${BASE_URL}/${grupoId}/participantes`);
  return response.data.data;
};

export const adicionarParticipanteGrupo = async (grupoId: number, usuarioId: number): Promise<void> => {
  await api.post(`${BASE_URL}/${grupoId}/participantes/${usuarioId}`);
};

export const removerParticipanteGrupo = async (grupoId: number, usuarioId: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${grupoId}/participantes/${usuarioId}`);
};

const mensagemGrupoService = {
  buscarMensagensGrupo,
  enviarMensagemGrupo,
  marcarMensagensComoLidas,
  silenciarGrupo,
  sairDoGrupo,
  buscarGruposComMensagensNaoLidas,
  buscarParticipantesGrupo,
  adicionarParticipanteGrupo,
  removerParticipanteGrupo,
};

export default mensagemGrupoService; 