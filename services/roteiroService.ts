import api from "./api";

interface RoteiroRequestManual {
  observacao: string;
  valorEstimado?: number;
  tipoViagem: "ECONOMICA" | "CONFORTAVEL" | "LUXO";
  descricao?: string;
}

interface RoteiroRequestIA {
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

export const gerarRoteiroComIa = async (
  viagemId: number,
  data: RoteiroRequestIA
) => {
  return await api.post(`/roteiros/gerar/${viagemId}`, data);
};

export const getRoteiroByViagemId = async (
  viagemId: number
): Promise<RoteiroResponseDTO | null> => {
  try {
    const response = await api.get<{ data: RoteiroResponseDTO }>(
      `/roteiros/viagem/${viagemId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Erro inesperado ao buscar roteiro:", error);
    return null;
  }
};

export const atualizarRoteiro = async (
  roteiroId: number,
  data: RoteiroRequestManual
) => {
  return await api.put(`/roteiros/${roteiroId}`, data);
};

export const deletarRoteiroByViagemId = async (viagemId: number) => {
  return await api.delete(`/roteiros/viagem/${viagemId}`);
};

export const baixarRoteiroPdf = async (roteiroId: number): Promise<Blob> => {
  const response = await api.get<Blob>(`/roteiros/${roteiroId}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};

export const getNomesParticipantes = async (viagemId: number): Promise<string[]> => {
  const response = await api.get<string[]>(`/viagens/${viagemId}/participantes/nomes`);
  return response.data;
};



export const enviarRoteiroPorEmail = async (
  roteiroId: number,
  email: string
) => {
  return await api.post(`/roteiros/${roteiroId}/enviar-email`, null, {
    params: { email },
  });
};
