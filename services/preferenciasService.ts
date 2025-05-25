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
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const salvarPreferenciasViagem = async (viagemId: number, preferencias: PreferenciasDTO) => {
  const response = await api.post<ApiResponse<PreferenciasDTO>>(
    `/preferencias/viagem/${viagemId}`,
    preferencias
  );
  return response.data.data;
};

export const getPreferenciasDoUsuario = async (): Promise<PreferenciasDTO | null> => {
  try {
    const response = await api.get<ApiResponse<PreferenciasDTO>>(`/preferencias/usuario`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const salvarPreferenciasDoUsuario = async (preferencias: PreferenciasDTO) => {
  const response = await api.post<ApiResponse<PreferenciasDTO>>(
    `/preferencias/usuario`,
    preferencias
  );
  return response.data.data;
};

export const atualizarPreferenciasDoUsuario = async (preferencias: PreferenciasDTO) => {
  const response = await api.put<ApiResponse<PreferenciasDTO>>(
    `/preferencias/usuario`,
    preferencias
  );
  return response.data.data;
};
