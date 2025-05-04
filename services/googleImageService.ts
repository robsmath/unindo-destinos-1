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
    });

    const item = response.data.items?.[0];
    return item?.link || null;
  } catch (error: any) {
    const status = error?.response?.status;
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
