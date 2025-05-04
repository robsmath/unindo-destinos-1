export interface UsuarioBuscaDTO {
    id: number;
    nome: string;
    fotoPerfil: string | null;
    genero: "MASCULINO" | "FEMININO" | "OUTRO";
    idade: number;
  
    petFriendly: boolean;
    aceitaCriancas: boolean;
    aceitaFumantes: boolean;
    aceitaBebidasAlcoolicas: boolean;
    acomodacaoCompartilhada: boolean;
    aceitaAnimaisGrandePorte: boolean;
  
    tipoHospedagem: string;
    transporteFavorito: string;
  }
  