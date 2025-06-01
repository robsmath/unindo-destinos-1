export interface MensagemDTO {
  id: number;
  conteudo: string;
  dataEnvio: string;
  visualizada: boolean;

  remetenteId: number;
  destinatarioId: number;
}
