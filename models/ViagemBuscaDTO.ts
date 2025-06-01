export interface ViagemBuscaDTO {
  id: number;
  destino: string;                             
  dataInicio: string;                          
  dataFim: string;                            

  status: "RASCUNHO" | "PENDENTE" | "CONFIRMADA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
  categoriaViagem: "NACIONAL" | "INTERNACIONAL";
  estiloViagem: 
    | "AVENTURA" | "CULTURA" | "FESTA" | "RELAXAMENTO"
    | "GASTRONOMIA" | "ECOTURISMO" | "NEGOCIOS" | "ROMANTICA"
    | "RELIGIOSA" | "COMPRAS" | "PRAIA" | "HISTORICA"
    | "TECNOLOGIA" | "NAO_TENHO_PREFERENCIA";

  criadorId: number;
  criadorNome: string;
  criadorFoto?: string;

  generoPreferido?: string;
  idadeMinima?: number;
  idadeMaxima?: number;

  petFriendly?: boolean;
  aceitaCriancas?: boolean;
  aceitaFumantes?: boolean;
  aceitaBebidasAlcoolicas?: boolean;
  acomodacaoCompartilhada?: boolean;

  tipoAcomodacao?: string;
  tipoTransporte?: string;

  valorMedioViagem: number;

  descricao?: string;
  quantidadeParticipantes: number;
  numeroMaximoParticipantes?: number;
}
