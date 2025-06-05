import api from './api';
import { AlbumFotoDTO } from '@/models/AlbumFotoDTO';

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  data: T;
}

export const uploadFotoAlbum = async (file: File): Promise<AlbumFotoDTO> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<any>(
    "/album-fotos/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );
  
  // Verificar se a resposta tem a estrutura ApiResponse ou é direta
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data;
  }
  return response.data;
};

export const listarFotosAlbum = async (): Promise<AlbumFotoDTO[]> => {
  const response = await api.get<AlbumFotoDTO[]>("/album-fotos", {
    withCredentials: true,
  });
  return response.data;
};

export const removerFotoAlbum = async (id: number): Promise<void> => {
  await api.delete(`/album-fotos/${id}`, { withCredentials: true });
};

export const listarFotosAlbumUsuario = async (usuarioId: number): Promise<AlbumFotoDTO[]> => {
  const response = await api.get<AlbumFotoDTO[]>(`/album-fotos/usuario/${usuarioId}`);
  return response.data;
};
