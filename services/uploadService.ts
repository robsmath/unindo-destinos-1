import api from "./api";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const uploadFotoPerfil = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<string>>(
    `/upload/perfil`,
    formData
  );

  return response.data.data;
};
