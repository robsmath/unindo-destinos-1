export interface UsuarioDTO {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    genero: "MASCULINO" | "FEMININO" | "OUTRO" | "";
    cpf: string;
    fotoPerfil?: string;
    endereco?: EnderecoDTO;
    // preferencia?: PreferenciaDTO; // Se quiser adicionar depois
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
  