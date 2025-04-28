import api from "./api";
import { UsuarioDTO } from "@/models/UsuarioDTO";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  fotoPerfil?: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
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
    id: number;
    emailVerificado: boolean;
    telefoneVerificado: boolean;
  };
}

export const cadastrarUsuario = async (dados: any) => {
  const response = await api.post<ApiResponse<UsuarioDTO>>("/usuarios", dados);
  return response.data.data;
};




