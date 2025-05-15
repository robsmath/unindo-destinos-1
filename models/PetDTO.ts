export interface PetDTO {
  id?: number;
  nome: string;
  raca: string;
  porte: string;
  sexo: "MACHO" | "FEMEA";
  dataNascimento: string;
  observacao?: string;
  foto?: string;
  descricao?: string;
  idUsuario?: number;
}
