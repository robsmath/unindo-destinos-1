const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicon() {
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo', 'unindo-destinos-logo.png');
  const faviconSizes = [16, 32, 48];
  
  try {
    console.log('🚀 Gerando favicon a partir da logo...');
    
    await fs.access(logoPath);
    console.log('✅ Logo encontrada:', logoPath);
    
    const faviconPath = path.join(__dirname, '..', 'app', 'favicon.ico');
    
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'favicon-32x32.png'));
    
    console.log('✅ Favicon 32x32 gerado');
    
    await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'favicon-16x16.png'));
    
    console.log('✅ Favicon 16x16 gerado');
    
    await sharp(logoPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));
    
    console.log('✅ Apple touch icon gerado');
    
    const pwaIconPath = path.join(__dirname, '..', 'public', 'icons', 'icon-192x192.png');
    try {
      await fs.access(pwaIconPath);
      console.log('ℹ️ Ícone PWA 192x192 já existe');
    } catch {
      await sharp(logoPath)
        .resize(192, 192, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(pwaIconPath);
      console.log('✅ Ícone PWA 192x192 gerado');
    }
    
    console.log('🎉 Todos os favicons foram gerados com sucesso!');
    console.log('📁 Arquivos gerados:');
    console.log('  - public/favicon-16x16.png');
    console.log('  - public/favicon-32x32.png');
    console.log('  - public/apple-touch-icon.png');
    console.log('  - public/icons/icon-192x192.png (se não existia)');
      } catch (error) {
    console.error('❌ Erro ao gerar favicon:', error);
    console.error('Stack trace:', error.stack);
  }
}

console.log('🔄 Iniciando script de geração de favicon...');
generateFavicon().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
