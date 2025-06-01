import api from "./api";
import { NovaMensagemDTO } from "@/models/NovaMensagemDTO";
import { MensagemDTO } from "@/models/MensagemDTO";
import { RemetenteComMensagensDTO } from "@/models/RemetenteComMensagensDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

const BASE_URL = "/mensagens";

export const enviarMensagem = async (novaMensagem: NovaMensagemDTO): Promise<MensagemDTO> => {
  const response = await api.post<ApiResponse<MensagemDTO>>(`${BASE_URL}`, novaMensagem);
  return response.data.data;
};

export const buscarConversa = async (usuarioId: number): Promise<MensagemDTO[]> => {
  const response = await api.get<ApiResponse<MensagemDTO[]>>(`${BASE_URL}/conversa/${usuarioId}`);
  return response.data.data;
};

export const buscarMensagensNaoLidas = async (): Promise<MensagemDTO[]> => {
  const response = await api.get<ApiResponse<MensagemDTO[]>>(`${BASE_URL}/nao-lidas`);
  return response.data.data;
};

export const marcarComoVisualizada = async (mensagemId: number): Promise<void> => {
  await api.put(`${BASE_URL}/${mensagemId}/visualizar`);
};

export const marcarConversaComoVisualizada = async (usuarioId: number): Promise<void> => {
  await api.put(`${BASE_URL}/conversa/${usuarioId}/visualizar`);
};

export const buscarRemetentesComMensagensNaoLidas = async (): Promise<RemetenteComMensagensDTO[]> => {
  const response = await api.get<ApiResponse<RemetenteComMensagensDTO[]>>(`${BASE_URL}/nao-lidas/remetentes`);
  return response.data.data;
};

const mensagemService = {
  enviarMensagem,
  buscarConversa,
  buscarMensagensNaoLidas,
  marcarComoVisualizada,
  marcarConversaComoVisualizada,
  buscarRemetentesComMensagensNaoLidas,
};

export default mensagemService;
