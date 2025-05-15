import api from "./api";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

/**
 * Faz upload de uma imagem para o perfil de usuário ou pet.
 * @param file Arquivo a ser enviado
 * @param tipo "USUARIO" ou "PET"
 * @returns URL da imagem salva
 */
export const uploadFotoPerfil = async (
  file: File,
  tipo: "USUARIO" | "PET" = "USUARIO"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const endpoint = tipo === "PET" ? "/upload/pet" : "/upload/perfil";

  const response = await api.post<ApiResponse<string>>(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};
