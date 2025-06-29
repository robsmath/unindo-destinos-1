export const formatarDataViagem = (dataISO: string): string => {
  if (!dataISO) return "Data inválida";
  
  let data: Date;
  
  if (dataISO.includes('T') || dataISO.includes('Z')) {
    data = new Date(dataISO);
  } else {
    data = new Date(dataISO + "T12:00:00");
  }
  
  if (isNaN(data.getTime())) return "Data inválida";
  
  return data.toLocaleDateString("pt-BR");
};


export const formatarDataCompleta = (dataISO: string): string => {
  if (!dataISO) return "Data inválida";
  
  let data: Date;
  
  if (dataISO.includes('T') || dataISO.includes('Z')) {
    data = new Date(dataISO);
  } else {
    data = new Date(dataISO + "T12:00:00");
  }
  
  if (isNaN(data.getTime())) return "Data inválida";
  
  return data.toLocaleDateString("pt-BR", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};


export const formatarPeriodoViagem = (dataInicio: string, dataFim: string): string => {
  const inicio = formatarDataViagem(dataInicio);
  const fim = formatarDataViagem(dataFim);
  
  if (inicio === "Data inválida" || fim === "Data inválida") {
    return "Período inválido";
  }
  
  return `${inicio} - ${fim}`;
};


export const criarDataSegura = (dataISO: string): Date => {
  if (!dataISO) return new Date();
  
  let data: Date;
  
  if (dataISO.includes('T') || dataISO.includes('Z')) {
    data = new Date(dataISO);
  } else {
    data = new Date(dataISO + "T12:00:00");
  }
  
  if (isNaN(data.getTime())) return new Date();
  
  return data;
}; 