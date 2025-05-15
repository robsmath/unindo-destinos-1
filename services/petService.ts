import api from "./api";
import { PetDTO } from "@/models/PetDTO";
interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const cadastrarPet = async (dados: PetDTO): Promise<PetDTO> => {
  const response = await api.post<ApiResponse<PetDTO>>("/pets", dados);
  return response.data.data;
};

export const editarPet = async (id: number, dados: PetDTO): Promise<void> => {
  await api.put(`/pets/${id}`, dados);
};

export const getMeusPets = async (): Promise<PetDTO[]> => {
  const response = await api.get<ApiResponse<PetDTO[]>>("/pets/meus");
  return response.data.data;
};

export const deletarPet = async (id: number): Promise<void> => {
  await api.delete(`/pets/${id}`);
};

export const getPetById = async (id: number): Promise<PetDTO> => {
  const response = await api.get<ApiResponse<PetDTO>>(`/pets/${id}`);
  return response.data.data;
};
