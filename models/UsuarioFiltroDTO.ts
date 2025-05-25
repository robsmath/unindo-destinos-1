export interface UsuarioFiltroDTO {
  genero?: "MASCULINO" | "FEMININO" | "NAO_BINARIO" | "OUTRO" | "" | undefined;

  idadeMin?: number | "";
  idadeMax?: number | "";

  valorMedioMin?: number | "";
  valorMedioMax?: number | "";

  petFriendly?: boolean;
  aceitaCriancas?: boolean;
  aceitaFumantes?: boolean;
  aceitaBebidasAlcoolicas?: boolean;
  acomodacaoCompartilhada?: boolean;

  tipoAcomodacao?: string;
  tipoTransporte?: string;

  apenasVerificados?: boolean;
}
