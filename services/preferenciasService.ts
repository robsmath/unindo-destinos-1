import api from "./api";

import { PreferenciasDTO } from "@/models/PreferenciasDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const getPreferenciaByViagemId = async (viagemId: number): Promise<PreferenciasDTO | null> => {
  try {
    const response = await api.get<ApiResponse<PreferenciasDTO>>(`/preferencias/viagem/${viagemId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};


export const salvarPreferenciasViagem = async (viagemId: number, preferencias: PreferenciasDTO) => {
  try {
    const response = await api.post(`/preferencias/salvar/${viagemId}`, preferencias);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar preferências:", error);
    throw error;
  }
};
