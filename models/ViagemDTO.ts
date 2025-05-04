export interface ViagemDTO {
  id: number;
  destino: string;
  dataInicio: string; // formato ISO, tipo "2025-05-01"
  dataFim: string;    // formato ISO, tipo "2025-05-10"
  estilo:
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
  status:
    | "RASUNHO"
    | "PENDENTE"
    | "CONFIRMADA"
    | "EM_ANDAMENTO"
    | "CONCLUIDA"
    | "CANCELADA";
  categoriaViagem: "NACIONAL" | "INTERNACIONAL";
  criadorViagemId: number;
}
