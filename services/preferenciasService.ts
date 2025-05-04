import api from "./api";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

// 🔹 Preferência da Viagem
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
    const response = await api.post<ApiResponse<PreferenciasDTO>>(`/preferencias/salvar/${viagemId}`, preferencias);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao salvar preferências da viagem:", error);
    throw error;
  }
};

// 🔹 Preferência do Usuário (com @AuthenticationPrincipal)
export const getPreferenciasDoUsuario = async (): Promise<PreferenciasDTO | null> => {
  try {
    const response = await api.get<ApiResponse<PreferenciasDTO>>(`/preferencias/usuario`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const salvarPreferenciasDoUsuario = async (preferencias: PreferenciasDTO) => {
  try {
    const response = await api.post<ApiResponse<PreferenciasDTO>>(`/preferencias/usuario`, preferencias);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao salvar preferências do usuário:", error);
    throw error;
  }
};

export const atualizarPreferenciasDoUsuario = async (preferencias: PreferenciasDTO) => {
  try {
    const response = await api.put<ApiResponse<PreferenciasDTO>>(`/preferencias/usuario`, preferencias);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao atualizar preferências do usuário:", error);
    throw error;
  }
};
