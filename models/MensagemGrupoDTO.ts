export interface MensagemGrupoDTO {
  id: number;
  conteudo: string;
  dataEnvio: string;
  remetenteId: number;
  remetenteNome: string;
}

export interface NovaMensagemGrupoDTO {
  conteudo: string;
} 