import api from "./api";

interface DiaRoteiroDTO {
  titulo: string;
  descricao: string;
}

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
  } catch (error) {
    console.error("Erro ao buscar roteiro por viagemId:", error);
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
