import api from "./api";

export const verificarEmail = (codigo: string) => {
  return api.post(`/verificacao/email/validar`, null, {
    params: { codigo },
  });
};

export const verificarTelefone = (codigo: string) => {
  return api.post(`/verificacao/sms/validar`, null, {
    params: { codigo },
  });
};

export const reenviarEmail = () => {
  return api.post(`/verificacao/email/enviar`);
};

export const reenviarSms = () => {
  return api.post(`/verificacao/sms/enviar`);
};
