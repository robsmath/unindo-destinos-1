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
  const response = await api.get<ApiResponse<UsuarioDTO>>("/usuarios/me");
  return response.data.data;
};

export const updateUsuarioLogado = async (userData: UsuarioDTO): Promise<UsuarioDTO> => {
  const response = await api.put<ApiResponse<UsuarioDTO>>("/usuarios/me", userData);
  return response.data.data;
};

export const deletarUsuarioLogado = async (): Promise<void> => {
  await api.delete("/usuarios/me");
};

export const buscarUsuarios = async (
  filtros: UsuarioFiltroDTO
): Promise<UsuarioBuscaDTO[]> => {
  const response = await api.post<ApiResponse<UsuarioBuscaDTO[]>>(
    "/usuarios/encontrar",
    filtros
  );
  return response.data.data;
};

export const getUsuarioById = async (id: number): Promise<UsuarioBuscaDTO> => {
  const response = await api.get<ApiResponse<UsuarioBuscaDTO>>(`/usuarios/${id}`);
  return response.data.data;
};
