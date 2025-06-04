import { MotivoDenuncia } from "./MotivoDenuncia";

export interface DenunciaDTO {
  id?: number;
  motivo: MotivoDenuncia;
  descricao: string;
  data?: string;
  status?: boolean; 
  observacao?: string;
  denunciadoId: number;
}
