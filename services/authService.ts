import api from "./api";
import { UsuarioDTO } from "@/models/UsuarioDTO";


interface LoginResponse {
  token: string;
  usuario: UsuarioDTO;
}

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const signIn = async (email: string, senha: string): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
    email,
    senha,
  });
  return response.data.data;
};

interface ApiResponseCadastro {
  timestamp: string;
  status: number;
  message: string;
  data: {
    emailVerificado: boolean;
    telefoneVerificado: boolean;
  };
}

export const cadastrarUsuario = async (dados: UsuarioDTO): Promise<UsuarioDTO> => {
  const response = await api.post<ApiResponse<UsuarioDTO>>("/usuarios", dados);
  return response.data.data;
};
