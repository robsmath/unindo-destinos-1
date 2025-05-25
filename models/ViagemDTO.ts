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

export type StatusViagem =
  | "RASCUNHO"
  | "PENDENTE"
  | "CONFIRMADA"
  | "EM_ANDAMENTO"
  | "CONCLUIDA"
  | "CANCELADA";

export type CategoriaViagem = "NACIONAL" | "INTERNACIONAL";

export interface ViagemDTO {
  id: number;
  destino: string;
  dataInicio: string; // formato ISO: "2025-05-01"
  dataFim: string;    // formato ISO: "2025-05-10"
  estilo: EstiloViagem;
  status: StatusViagem;
  categoriaViagem: CategoriaViagem;
  criadorViagemId?: number;
}
