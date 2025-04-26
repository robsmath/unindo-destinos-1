import api from "./api";

interface UnsplashImage {
  urls: {
    regular: string;
  };
}

interface UnsplashResponse {
  results: UnsplashImage[];
}

export const getImage = async (query: string): Promise<string | null> => {
  const response = await api.get<UnsplashResponse>(
    "https://api.unsplash.com/search/photos",
    {
      params: {
        query: encodeURIComponent(query),
        client_id: 'eICEPRHv7p2i2XjIG5Vbotl7Nkzc9KOl9YX1EGIZWvc',
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
