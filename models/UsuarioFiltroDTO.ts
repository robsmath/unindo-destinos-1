export interface UsuarioFiltroDTO {
  nome?: string;
  email?: string;

  genero?: "MASCULINO" | "FEMININO" | "NAO_BINARIO" | "OUTRO" | "";

  idadeMin?: number | "";
  idadeMax?: number | "";

  valorMedioMax?: number | "";

  petFriendly?: boolean;
  aceitaCriancas?: boolean;
  aceitaFumantes?: boolean;
  aceitaBebidasAlcoolicas?: boolean;
  acomodacaoCompartilhada?: boolean;

  tipoAcomodacao?: string;
  tipoTransporte?: string;

  apenasVerificados?: boolean;

  idsQueEuBloqueei?: number[];
  idsQueMeBloquearam?: number[];
}
