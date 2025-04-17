import api from "./api";

export const login = async (email: string, senha: string) => {
  return api.post("/login", {
    email,
    senha,
  });
};

export const cadastrarUsuario = async (dados: any) => {
  return api.post("/usuarios", dados);
};
