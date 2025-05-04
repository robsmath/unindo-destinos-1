export interface UsuarioFiltroDTO {
    genero?: "MASCULINO" | "FEMININO" | "OUTRO" | "";
    idadeMin?: number | "";
    idadeMax?: number | "";
    valorMedioViagem?: number | "";
  
    petFriendly?: boolean;
    aceitaCriancas?: boolean;
    aceitaFumantes?: boolean;
    aceitaBebidasAlcoolicas?: boolean;
    acomodacaoCompartilhada?: boolean;
    aceitaAnimaisGrandePorte?: boolean;
  
    tipoAcomodacao?: string;
    tipoTransporte?: string;
  }
  