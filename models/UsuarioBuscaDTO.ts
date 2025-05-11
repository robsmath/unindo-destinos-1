export interface UsuarioBuscaDTO {
  id: number;
  nome: string;
  genero: string;
  idade: number;
  fotoPerfil?: string;
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
  descricao?: string;
  tipoAcomodacao?: string;
  tipoTransporte?: string;
  petFriendly?: boolean;
  aceitaCriancas?: boolean;
  aceitaFumantes?: boolean;
  aceitaBebidasAlcoolicas?: boolean;
  acomodacaoCompartilhada?: boolean;
  aceitaAnimaisGrandePorte?: boolean;
}
