export type Genero =
  | "MASCULINO"
  | "FEMININO"
  | "NAO_BINARIO"
  | "OUTRO"
  | "TODOS"
  | "NAO_TENHO_PREFERENCIA";

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

export type TipoAcomodacao =
  | "HOTEL"
  | "HOSTEL"
  | "AIRBNB"
  | "POUSADA"
  | "CAMPING"
  | "RESORT"
  | "FAZENDA"
  | "CASA_DE_AMIGOS"
  | "NAO_TENHO_PREFERENCIA";

export type TipoTransporte =
  | "AVIAO"
  | "CARRO"
  | "ONIBUS"
  | "TREM"
  | "NAVIO"
  | "MOTO"
  | "BICICLETA"
  | "VAN"
  | "MOTORHOME"
  | "NAO_TENHO_PREFERENCIA";

export interface PreferenciasDTO {
  generoPreferido: Genero;
  idadeMinima: number | null;
  idadeMaxima: number | null;
  valorMedioViagem: number | null;

  petFriendly: boolean;
  aceitaCriancas: boolean;
  aceitaFumantes: boolean;
  aceitaBebidasAlcoolicas: boolean;
  acomodacaoCompartilhada: boolean;

  estiloViagem: EstiloViagem;
  tipoAcomodacao: TipoAcomodacao;
  tipoTransporte: TipoTransporte;
}
