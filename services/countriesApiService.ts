import axios from "axios";
import paisesTraduzidos from "@/models/paisesTraduzidos";

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

/**
 * Busca lista de países da API restcountries.com com fallback robusto
 * 
 * Esta função resolve o problema do erro 400 "'fields' query not specified"
 * da API restcountries.com adicionando o parâmetro ?fields=name na URL.
 * 
 * Implementa as seguintes melhorias:
 * - URL corrigida com campo específico para evitar erro 400
 * - Timeout de 10 segundos para evitar travamento
 * - Headers apropriados para melhor compatibilidade 
 * - Fallback automático para lista estática em caso de falha
 * - Filtro de valores nulos/undefined
 * 
 * @returns Promise<string[]> Lista de países em inglês, ordenada alfabeticamente
 */
export const getPaisesRestCountries = async (): Promise<string[]> => {
  try {
    // Implementar timeout para evitar travamento da requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    // URL corrigida com campo específico para resolver erro 400
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name", {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    // Verificar se a resposta HTTP foi bem-sucedida
    if (!response.ok) {
      throw new Error(`API restcountries retornou status ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validar estrutura da resposta e processar dados
    if (Array.isArray(data) && data.length > 0) {
      const paises = data
        .map((country) => country.name?.common)
        .filter(Boolean) // Remove valores null/undefined
        .sort();
        
      console.log(`✅ Carregados ${paises.length} países da API restcountries`);
      return paises;
    } else {
      throw new Error("API retornou estrutura de dados inválida ou lista vazia");
    }
  } catch (error) {
    // Log detalhado do erro para debug
    if (error.name === 'AbortError') {
      console.warn("⚠️ Timeout na API restcountries (>10s), usando fallback");
    } else {
      console.warn("⚠️ Erro na API restcountries:", error.message || error);
    }
    
    // Fallback: usar lista estática confiável do arquivo paisesTraduzidos
    const paisesEstaticos = Object.keys(paisesTraduzidos).sort();
    console.log(`🔄 Usando lista estática com ${paisesEstaticos.length} países`);
    
    return paisesEstaticos;
  }
};

// Função utilitária para verificar se um país existe na lista traduzida
export const getPaisTraduzido = (paisIngles: string): string => {
  return paisesTraduzidos[paisIngles] || paisIngles;
};

// Função para buscar país em inglês a partir do nome traduzido
export const getPaisIngles = (paisTraduzido: string): string => {
  const entrada = Object.entries(paisesTraduzidos).find(([_, valor]) => valor === paisTraduzido);
  return entrada ? entrada[0] : paisTraduzido;
};
