import axios from "axios";

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

export const getImage = async (destino: string, tipoViagem: string): Promise<string | null> => {
  const maxTentativas = 2; // Menos tentativas para o fallback
  
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      let query = destino;

      if (tipoViagem === "INTERNACIONAL") {
        query += " travel landscape";
      } else {
        query += " - cidade no Brasil";
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
          timeout: 6000, // 6 segundos de timeout
        }
      );

      const photo = response.data.results[0];
      if (photo?.urls?.regular) {
        return photo.urls.regular;
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const isRetryableError = status === 503 || status === 500 || error.code === 'ECONNABORTED';
      
      console.warn(`Unsplash tentativa ${tentativa} falhou para "${destino}":`, {
        status,
        message: error.message,
        code: error.code
      });

      // Se é um erro que vale a pena tentar novamente e não é a última tentativa
      if (isRetryableError && tentativa < maxTentativas) {
        const delay = 2000; // 2 segundos fixos para o fallback
        console.log(`Aguardando ${delay}ms antes da próxima tentativa no Unsplash...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Se chegou na última tentativa, loga o erro final
      if (tentativa === maxTentativas) {
        console.error("Erro final ao buscar imagem no Unsplash:", error);
      }
    }
  }

  return null;
};
