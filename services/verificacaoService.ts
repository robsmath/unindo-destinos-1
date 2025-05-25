import api from "./api";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

export const verificarEmail = async (codigo: string): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>(`/verificacao/email/validar`, null, {
    params: { codigo },
  });
  return response.data;
};

export const verificarTelefone = async (codigo: string): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>(`/verificacao/sms/validar`, null, {
    params: { codigo },
  });
  return response.data;
};

export const reenviarEmail = async (): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>(`/verificacao/email/enviar`);
  return response.data;
};

export const reenviarSms = async (): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>(`/verificacao/sms/enviar`);
  return response.data;
};
