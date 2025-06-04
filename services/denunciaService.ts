import api from "./api";
import { DenunciaDTO } from "@/models/DenunciaDTO";

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const registrarDenuncia = async (data: DenunciaDTO): Promise<DenunciaDTO> => {
  const response = await api.post<ApiResponse<DenunciaDTO>>("/denuncias", data);
  return response.data.data;
};

export const buscarMinhasDenuncias = async (): Promise<DenunciaDTO[]> => {
  const response = await api.get<ApiResponse<DenunciaDTO[]>>("/denuncias/minhas");
  return response.data.data;
};
