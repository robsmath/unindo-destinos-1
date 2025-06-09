// Paleta de cores harmoniosas para os usuários
const USER_COLORS = [
  '#FF6B6B', // Vermelho suave
  '#4ECDC4', // Turquesa
  '#45B7D1', // Azul
  '#96CEB4', // Verde claro
  '#FFEAA7', // Amarelo suave
  '#DDA0DD', // Lavanda
  '#FFB347', // Laranja suave
  '#98D8C8', // Verde menta
  '#F7DC6F', // Amarelo dourado
  '#BB8FCE', // Roxo claro
  '#85C1E9', // Azul claro
  '#F8C471', // Pêssego
  '#82E0AA', // Verde suave
  '#F1948A', // Rosa claro
  '#85C1E9', // Azul céu
];

/**
 * Gera uma cor consistente para um usuário baseado no seu ID
 * @param userId - ID do usuário
 * @returns Cor em formato hexadecimal
 */
export const getUserColor = (userId: number): string => {
  const index = userId % USER_COLORS.length;
  return USER_COLORS[index];
};

/**
 * Retorna se a cor é clara ou escura para determinar a cor do texto
 * @param hexColor - Cor em formato hexadecimal
 * @returns true se a cor for clara, false se for escura
 */
export const isLightColor = (hexColor: string): boolean => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Fórmula para calcular luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
}; 