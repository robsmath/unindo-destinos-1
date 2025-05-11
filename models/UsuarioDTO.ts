import { PreferenciasDTO } from "./PreferenciasDTO";
export interface UsuarioDTO {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  emailVerificado?: boolean;
  telefoneVerificado?: boolean;
  dataNascimento: string;
  genero: "MASCULINO" | "FEMININO" | "OUTRO" | "";
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
  