export interface ViagemFiltroDTO {
  destino?: string;
  tipoViagem?: "NACIONAL" | "INTERNACIONAL" | "";
  estiloViagem?: string; 
  dataInicioMin?: string; 
  dataInicioMax?: string; 
  valorMedioMin?: number | "";
  valorMedioMax?: number | "";
  status?: string;
  apenasVagasAbertas?: boolean;
  criadorNome?: string;
}
