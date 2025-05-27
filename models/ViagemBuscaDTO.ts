export interface ViagemBuscaDTO {
  id: number;
  destino: string;           // Cidade - Estado - País
  tipoViagem: "NACIONAL" | "INTERNACIONAL";
  estiloViagem: string;
  dataInicio: string;        // yyyy-MM-dd
  dataFim: string;           // yyyy-MM-dd
  valorMedio: number;
  status: string;            // "ABERTA", "CONFIRMADA", "CANCELADA", etc.
  vagasRestantes: number;    // Quantidade de vagas disponíveis
  maxParticipantes?: number; // Opcional, se existir no backend
  criadorNome: string;
  criadorFoto?: string;      // Foto do criador, opcional
  descricao?: string;        // Descrição/resumo da viagem
}
