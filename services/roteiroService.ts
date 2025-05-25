import api from "./api";

export interface RoteiroRequestManual {
  observacao: string;
  valorEstimado?: number;
  tipoViagem: "ECONOMICA" | "CONFORTAVEL" | "LUXO";
  descricao?: string;
}

export interface RoteiroRequestIA {
  observacao: string;
  tipoViagem: "ECONOMICA" | "CONFORTAVEL" | "LUXO";
}

export interface RoteiroResponseDTO {
  id: number;
  dataGeracao: string;
  observacao: string;
  idViagem: number;
  valorEstimado?: number;
  tipoViagem?: "ECONOMICA" | "CONFORTAVEL" | "LUXO";
  descricao?: string;
  tentativasGeracaoRoteiro?: number;
}

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const gerarRoteiroComIa = async (
  viagemId: number,
  data: RoteiroRequestIA
): Promise<RoteiroResponseDTO> => {
  const response = await api.post<ApiResponse<RoteiroResponseDTO>>(
    `/roteiros/gerar/${viagemId}`,
    data
  );
  return response.data.data;
};

export const getRoteiroByViagemId = async (
  viagemId: number
): Promise<RoteiroResponseDTO | null> => {
  try {
    const response = await api.get<ApiResponse<RoteiroResponseDTO>>(
      `/roteiros/viagem/${viagemId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getRoteiroById = async (
  roteiroId: number
): Promise<RoteiroResponseDTO> => {
  const response = await api.get<ApiResponse<RoteiroResponseDTO>>(
    `/roteiros/${roteiroId}`
  );
  return response.data.data;
};

export const atualizarRoteiro = async (
  roteiroId: number,
  data: RoteiroRequestManual
): Promise<RoteiroResponseDTO> => {
  const response = await api.put<ApiResponse<RoteiroResponseDTO>>(
    `/roteiros/${roteiroId}`,
    data
  );
  return response.data.data;
};

export const deletarRoteiroByViagemId = async (viagemId: number): Promise<void> => {
  await api.delete(`/roteiros/viagem/${viagemId}`);
};

export const deletarRoteiroById = async (roteiroId: number): Promise<void> => {
  await api.delete(`/roteiros/${roteiroId}`);
};

export const baixarRoteiroPdf = async (roteiroId: number): Promise<Blob> => {
  const response = await api.get<Blob>(`/roteiros/${roteiroId}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};

export const enviarRoteiroPorEmail = async (
  roteiroId: number,
  email: string
): Promise<void> => {
  await api.post(`/roteiros/${roteiroId}/enviar-email`, null, {
    params: { email },
  });
};

export const getNomesParticipantes = async (
  viagemId: number
): Promise<string[]> => {
  const response = await api.get<ApiResponse<string[]>>(
    `/viagens/${viagemId}/participantes/nomes`
  );
  return response.data.data;
};
