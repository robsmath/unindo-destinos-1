export type EstiloViagem =
  | "AVENTURA"
  | "CULTURA"
  | "FESTA"
  | "RELAXAMENTO"
  | "GASTRONOMIA"
  | "ECOTURISMO"
  | "NEGOCIOS"
  | "ROMANTICA"
  | "RELIGIOSA"
  | "COMPRAS"
  | "PRAIA"
  | "HISTORICA"
  | "TECNOLOGIA"
  | "NAO_TENHO_PREFERENCIA";

export type StatusViagem = "PENDENTE" | "CONFIRMADA";

export type CategoriaViagem = "NACIONAL" | "INTERNACIONAL";

export type Genero = "MASCULINO" | "FEMININO" | "OUTRO" | "TANTO_FAZ";

export type TipoAcomodacao =
  | "HOSTEL"
  | "HOTEL"
  | "AIRBNB"
  | "CAMPING"
  | "NAO_TENHO_PREFERENCIA";

export type TipoTransporte =
  | "AVIAO"
  | "ÔNIBUS"
  | "CARRO"
  | "TREM"
  | "NAVIO"
  | "NAO_TENHO_PREFERENCIA";

export interface ViagemFiltroDTO {
  destino?: string;
  dataInicio?: string;
  dataFim?: string;

  estiloViagem?: EstiloViagem;
  categoriaViagem?: CategoriaViagem;
  status?: StatusViagem;
  criadorId?: number;

  generoPreferido?: Genero;
  idadeMinima?: number;
  idadeMaxima?: number;
  valorMedioMax?: number;

  petFriendly?: boolean;
  aceitaCriancas?: boolean;
  aceitaFumantes?: boolean;
  aceitaBebidasAlcoolicas?: boolean;
  acomodacaoCompartilhada?: boolean;

  tipoAcomodacao?: TipoAcomodacao;
  tipoTransporte?: TipoTransporte;

  quantidadeMaximaParticipantes?: number;
  criadorNome?: string;
}
