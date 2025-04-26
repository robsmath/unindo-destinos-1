import api from "./api";
import { UsuarioDTO } from "@/models/UsuarioDTO";

export const getUserById = async (id: number): Promise<UsuarioDTO> => {
  const response = await api.get<UsuarioDTO>(`/usuarios/${id}`);
  return response.data;
};

export const updateUser = async (id: number, userData: UsuarioDTO): Promise<void> => {
  await api.put(`/usuarios/${id}`, userData);
};
