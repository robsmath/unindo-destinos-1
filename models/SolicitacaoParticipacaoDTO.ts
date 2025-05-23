export interface SolicitacaoParticipacaoDTO {
  id: number;
  viagemId: number;
  destino: string;
  dataInicio: string;
  dataFim: string;

  outroUsuarioId: number;
  outroUsuarioNome: string;
  outroUsuarioEmail: string;

  tipo: "CONVITE_ENVIADO" | "CONVITE_RECEBIDO" | "SOLICITACAO_ENVIADA" | "SOLICITACAO_RECEBIDA";
  usuarioLogadoId: number;

  status: "PENDENTE" | "APROVADA" | "RECUSADA";
}
