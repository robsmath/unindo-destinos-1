import api from "./api";

export const cadastrarViagem = async (dados: any) => {
  return api.post("/viagens", dados);
};
