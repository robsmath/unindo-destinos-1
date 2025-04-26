import api from "./api";

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

interface ApiResponse {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: LoginResponse;
}

export const signIn = async (email: string, senha: string): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse>("/auth/login", {
    email,
    senha,
  });

  return response.data.data;
};

export const cadastrarUsuario = async (dados: any) => {
  return api.post("/usuarios", dados);
};
