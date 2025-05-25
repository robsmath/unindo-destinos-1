import { PreferenciasDTO } from "./PreferenciasDTO";

export type Genero =
  | "MASCULINO"
  | "FEMININO"
  | "NAO_BINARIO"
  | "OUTRO"
  | "NAO_TENHO_PREFERENCIA";

export interface UsuarioDTO {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
  dataNascimento: string;
  genero: Genero | "" | undefined;
  cpf: string;
  fotoPerfil?: string;
  descricao?: string;
  endereco?: EnderecoDTO;
  preferencia?: PreferenciasDTO;
}

export interface EnderecoDTO {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}
