import api from "./api";

interface UnsplashResponse {
  results: {
    urls: {
      regular: string;
    };
  }[];
}

export const getImage = async (query: string) => {
  const response = await api.get<UnsplashResponse>(
    "https://api.unsplash.com/search/photos",
    {
      params: {
        query: encodeURIComponent(query),
        client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
        per_page: 1,
      },
    },
  );

  const data = response.data;

  if (data.results && data.results.length > 0) {
    return data.results[0].urls.regular;
  }
  return null;
};
