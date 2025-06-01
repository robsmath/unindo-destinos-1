// Script para criar favicon.ico verdadeiro
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function createRealFavicon() {
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo', 'unindo-destinos-logo.png');
  const faviconPath = path.join(__dirname, '..', 'app', 'favicon.ico');
  
  try {
    console.log('🚀 Criando favicon.ico verdadeiro...');
    
    // Verificar se a logo existe
    await fs.access(logoPath);
    console.log('✅ Logo encontrada:', logoPath);
    
    // Gerar favicon.ico de 32x32
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('✅ Favicon.ico criado:', faviconPath);
    console.log('🎉 Favicon atualizado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar favicon.ico:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Executar a função
console.log('🔄 Iniciando criação do favicon.ico...');
createRealFavicon().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
