import axios from "axios";

const API_HOST = "countries-states-and-cities.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_COUNTRIES_KEY;

const api = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    "X-RapidAPI-Key": API_KEY || "",
    "X-RapidAPI-Host": API_HOST,
  },
});

interface Localidade {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
}

export const getPaises = async (): Promise<Localidade[]> => {
  const response = await api.get<ApiResponse<Localidade[]>>("/countries");
  return response.data.data;
};

export const getEstadosPorPais = async (countryId: string): Promise<Localidade[]> => {
  const response = await api.get<ApiResponse<Localidade[]>>(`/countries/${countryId}/states`);
  return response.data.data;
};

export const getCidadesPorEstado = async (stateId: string): Promise<Localidade[]> => {
  const response = await api.get<ApiResponse<Localidade[]>>(`/states/${stateId}/cities`);
  return response.data.data;
};
