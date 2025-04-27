import axios from "axios";

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

export const getImage = async (query: string): Promise<string | null> => {
  try {
    const response = await axios.get<UnsplashResponse>(
      "https://api.unsplash.com/search/photos",
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
        params: {
          query,
          per_page: 1,
        },
      }
    );

    const photo = response.data.results[0];
    if (photo) {
      return photo.urls.regular;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar imagem no Unsplash:", error);
    return null;
  }
};
