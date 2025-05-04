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
      }
    );

    const photo = response.data.results[0];
    return photo ? photo.urls.regular : null;
  } catch (error) {
    console.error("Erro ao buscar imagem no Unsplash:", error);
    return null;
  }
};
