import api from "./api";
import { UsuarioDTO } from "@/models/UsuarioDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const getUserById = async (id: number): Promise<UsuarioDTO> => {
  const response = await api.get<ApiResponse<UsuarioDTO>>(`/usuarios/${id}`);
  return response.data.data;
};

export const updateUser = async (id: number, userData: UsuarioDTO): Promise<void> => {
  await api.put(`/usuarios/${id}`, userData);
};
