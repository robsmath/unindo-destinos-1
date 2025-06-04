export interface DenunciaDTO {
    id?: number;
    motivo: string;
    descricao: string;
    data?: string;
    foto?: string;
    status?: boolean;
    observacao?: string;
    denuncianteId?: number;
    denunciadoId: number;
  }
  