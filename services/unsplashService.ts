import axios from "axios";

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

// Cache simples em memória para evitar requisições desnecessárias
const imageCache = new Map<string, string>();

export const getImage = async (destino: string, tipoViagem: string): Promise<string | null> => {
  if (!destino) return null;

  // Criar chave de cache
  const cacheKey = `${destino}-${tipoViagem}`;
  
  // Verificar se já temos a imagem em cache
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    let query = destino;

    if (tipoViagem === "INTERNACIONAL") {
      query += " travel landscape";
    } else {
      query += " Brasil landscape";
    }

    const response = await axios.get<UnsplashResponse>(
      "https://api.unsplash.com/search/photos",
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
        params: {
          query,
          per_page: 1,
          orientation: "landscape",
        },
        timeout: 8000,
      }
    );

    const photo = response.data.results[0];
    if (photo?.urls?.regular) {
      // Salvar no cache
      imageCache.set(cacheKey, photo.urls.regular);
      return photo.urls.regular;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao buscar imagem no Unsplash:", error);
    return null;
  }
};
