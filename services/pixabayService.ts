import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_PIXABAY_KEY;
const BASE_URL = "https://pixabay.com/api/";

interface PixabayImage {
  webformatURL: string;
  largeImageURL: string;
  tags: string;
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

export async function getImage(term: string): Promise<string | null> {
  try {
    const response = await axios.get<PixabayResponse>(BASE_URL, {
      params: {
        key: API_KEY,
        q: term,
        image_type: "photo",
        category: "places",
        safesearch: true,
        per_page: 3,
      },
    });

    const hits = response.data.hits;
    if (hits && hits.length > 0) {
      return hits[0].webformatURL || hits[0].largeImageURL;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar imagem no Pixabay:", error);
    return null;
  }
}
