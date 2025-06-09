export interface GrupoComMensagensDTO {
  grupoId: number;
  nomeGrupo: string;
  quantidadeMensagensNaoLidas: number;
  ultimaMensagem?: string;
  dataUltimaMensagem?: string;
} 