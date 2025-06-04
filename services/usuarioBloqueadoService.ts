import api from "./api";
import { UsuarioBloqueadoDTO } from "@/models/UsuarioBloqueadoDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const bloquearUsuario = async (idParaBloquear: number): Promise<void> => {
  await api.post<ApiResponse<void>>(`/bloqueios/${idParaBloquear}`);
};

export const desbloquearUsuario = async (idParaDesbloquear: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/bloqueios/${idParaDesbloquear}`);
};

export const listarUsuariosBloqueados = async (): Promise<UsuarioBloqueadoDTO[]> => {
  const response = await api.get<ApiResponse<UsuarioBloqueadoDTO[]>>(`/bloqueios/minhas`);
  return response.data.data;
};
