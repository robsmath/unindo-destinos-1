import api from "./api";

export const verificarEmail = (usuarioId: number, codigo: string) => {
  return api.post(`/verificacao/email/validar/${usuarioId}?codigo=${codigo}`);
};

export const verificarTelefone = (usuarioId: number, codigo: string) => {
  return api.post(`/verificacao/sms/validar/${usuarioId}?codigo=${codigo}`);
};

export const reenviarEmail = (usuarioId: number) => {
  return api.post(`/verificacao/email/enviar/${usuarioId}`);
};

export const reenviarSms = (usuarioId: number) => {
  return api.post(`/verificacao/sms/enviar/${usuarioId}`);
};
