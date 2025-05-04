import api from "./api";
import { UsuarioDTO } from "@/models/UsuarioDTO";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { UsuarioFiltroDTO } from "@/models/UsuarioFiltroDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const getUsuarioLogado = async (): Promise<UsuarioDTO> => {
  const response = await api.get<ApiResponse<UsuarioDTO>>(`/usuarios/me`);
  return response.data.data;
};

export const updateUsuarioLogado = async (userData: UsuarioDTO): Promise<void> => {
  await api.put(`/usuarios/me`, userData);
};

export const buscarUsuarios = async (
  filtros: UsuarioFiltroDTO
): Promise<ApiResponse<UsuarioBuscaDTO[]>> => {
  const response = await api.post<ApiResponse<UsuarioBuscaDTO[]>>(
    "/usuarios/encontrar",
    filtros
  );
  return response.data;
};
