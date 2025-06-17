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

export const editarPet = async (id: number, dados: PetDTO): Promise<PetDTO> => {
  const response = await api.put<ApiResponse<PetDTO>>(`/pets/${id}`, dados);
  return response.data.data;
};

export const getMeusPets = async (): Promise<PetDTO[]> => {
  const response = await api.get<ApiResponse<PetDTO[]>>("/pets/meus");
  return response.data.data;
};

export const getPetsByUsuarioId = async (usuarioId: number): Promise<PetDTO[]> => {
  try {
    // Usa o mesmo padrão do álbum de fotos: endpoint direto sem ApiResponse wrapper
    const response = await api.get<PetDTO[]>(`/pets/usuario/${usuarioId}`);
    return response.data;
  } catch (error: any) {
    // Se endpoint não existir ou usuário não tiver pets, retorna array vazio
    if (error.response?.status === 404 || error.response?.status === 403) {
      return [];
    }
    // Para outros erros, relança a exceção
    console.error(`Erro ao buscar pets do usuário ${usuarioId}:`, error);
    return [];
  }
};

export const deletarPet = async (id: number): Promise<void> => {
  await api.delete(`/pets/${id}`);
};

export const getPetById = async (id: number): Promise<PetDTO> => {
  const response = await api.get<ApiResponse<PetDTO>>(`/pets/${id}`);
  return response.data.data;
};
