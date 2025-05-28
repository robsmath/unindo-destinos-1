import axios from "axios";
import { getImage as getImageUnsplash } from "./unsplashService";
import consultasImagemPersonalizada from "@/models/consultasImagensPersonalizadas";


const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_KEY;
const CX = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CX;

interface GoogleImageItem {
  link: string;
}

interface GoogleSearchResponse {
  items?: GoogleImageItem[];
}

function getConsultaDestino(destino: string, tipoViagem: string): string {
    if (consultasImagemPersonalizada[destino]) {
      return consultasImagemPersonalizada[destino];
    }
  
    if (tipoViagem === "INTERNACIONAL") {
      return `${destino} principais pontos turísticos site:tripadvisor.com OR site:wikipedia.org`;
    }
  
    const [cidade, estado] = destino.split(" - ");
    if (!cidade || !estado) return `${destino} ponto turístico Brasil`;
  
    return `${cidade}, ${estado} ponto turístico Brasil site:tripadvisor.com.br`;
  }

export async function getImage(destino: string, tipoViagem: string): Promise<string | null> {
  if (!destino) return null;

  const consulta = getConsultaDestino(destino, tipoViagem);

  // Sistema de retry para lidar com erros temporários (503, timeout, etc.)
  const maxTentativas = 3;
  
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      const response = await axios.get<GoogleSearchResponse>("https://www.googleapis.com/customsearch/v1", {
        params: {
          key: API_KEY,
          cx: CX,
          q: consulta,
          searchType: "image",
          num: 1,
          safe: "active",
        },
        timeout: 8000, // 8 segundos de timeout
      });

      const item = response.data.items?.[0];
      if (item?.link) {
        return item.link;
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const isRetryableError = status === 503 || status === 429 || status === 500 || error.code === 'ECONNABORTED';
      
      console.warn(`Tentativa ${tentativa} falhou para "${destino}":`, {
        status,
        message: error.message,
        code: error.code
      });

      // Se é um erro que vale a pena tentar novamente e não é a última tentativa
      if (isRetryableError && tentativa < maxTentativas) {
        const delay = Math.min(1000 * Math.pow(2, tentativa - 1), 5000); // Exponential backoff com máximo de 5s
        console.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Se chegou na última tentativa ou é um erro não recuperável, tenta o fallback
      if (tentativa === maxTentativas || !isRetryableError) {
        if (status === 429) {
          console.warn("Limite da API do Google atingido (429). Usando Unsplash como fallback.");
        } else {
          console.error("Erro ao buscar imagem no Google:", error);
        }

        try {
          return await getImageUnsplash(destino, tipoViagem);
        } catch (unsplashError) {
          console.error("Erro ao buscar imagem no Unsplash:", unsplashError);
          return null;
        }
      }
    }
  }

  return null;
}
