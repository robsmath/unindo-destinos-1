// Script para atualizar todos os ícones PWA com a logo
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function updatePWAIcons() {
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo', 'unindo-destinos-logo.png');
  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  try {
    console.log('🚀 Atualizando ícones PWA com a logo...');
    
    // Verificar se a logo existe
    await fs.access(logoPath);
    console.log('✅ Logo encontrada:', logoPath);
    
    // Verificar se o diretório de ícones existe
    const iconsDir = path.join(__dirname, '..', 'public', 'icons');
    try {
      await fs.access(iconsDir);
    } catch {
      await fs.mkdir(iconsDir, { recursive: true });
      console.log('📁 Diretório de ícones criado');
    }
    
    // Gerar todos os tamanhos de ícone PWA
    for (const size of iconSizes) {
      const iconPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 234, g: 88, b: 12, alpha: 1 } // Cor laranja do tema
        })
        .png()
        .toFile(iconPath);
      
      console.log(`✅ Ícone ${size}x${size} atualizado`);
    }
    
    console.log('🎉 Todos os ícones PWA foram atualizados com sucesso!');
    console.log('📱 Os ícones agora usam sua logo em vez do ícone genérico');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar ícones PWA:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Executar a função
console.log('🔄 Iniciando atualização dos ícones PWA...');
updatePWAIcons().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
