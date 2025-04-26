import api from "./api";

interface LoginResponse {
  data: string; // aqui o que o backend retorna (o JWT token)
}

export const signIn = async (email: string, senha: string): Promise<string> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    senha,
  });

  return response.data.data;
};

export const cadastrarUsuario = async (dados: any) => {
  return api.post("/usuarios", dados);
};
