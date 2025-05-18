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

export const enviarEmailRecuperacao = async (email: string): Promise<void> => {
  await api.post<ApiResponse<null>>("/auth/recuperar-senha", { email });
};

export const redefinirSenha = async (token: string, novaSenha: string): Promise<void> => {
  await api.post<ApiResponse<null>>("/auth/redefinir-senha", { token, novaSenha });
};
