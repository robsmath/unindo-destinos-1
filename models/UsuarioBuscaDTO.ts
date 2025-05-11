export interface UsuarioBuscaDTO {
  id: number;
  nome: string;
  fotoPerfil?: string;
  genero: "MASCULINO" | "FEMININO" | "OUTRO";
  idade: number;

  petFriendly: boolean;
  aceitaCriancas: boolean;
  aceitaFumantes: boolean;
  aceitaBebidasAlcoolicas: boolean;
  acomodacaoCompartilhada: boolean;
  aceitaAnimaisGrandePorte: boolean;

  tipoAcomodacao: string;
  tipoTransporte: string;

  emailVerificado: boolean;
  telefoneVerificado: boolean;
}
