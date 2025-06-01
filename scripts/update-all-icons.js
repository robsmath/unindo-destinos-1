// Script master para atualizar todos os favicons e ícones
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function updateAllIcons() {
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo', 'unindo-destinos-logo.png');
  
  try {
    console.log('🚀 Iniciando atualização completa de todos os ícones...');
    
    // Verificar se a logo existe
    await fs.access(logoPath);
    console.log('✅ Logo encontrada:', logoPath);
    
    // 1. Gerar favicons
    console.log('\n📱 Gerando favicons...');
    
    // Favicon 32x32
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'favicon-32x32.png'));
    console.log('✅ Favicon 32x32 gerado');
    
    // Favicon 16x16
    await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'favicon-16x16.png'));
    console.log('✅ Favicon 16x16 gerado');
    
    // Apple touch icon
    await sharp(logoPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));
    console.log('✅ Apple touch icon gerado');
    
    // Favicon.ico para app
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '..', 'app', 'favicon.ico'));
    console.log('✅ Favicon.ico gerado');
    
    // 2. Gerar ícones PWA
    console.log('\n🌐 Gerando ícones PWA...');
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    // Verificar se o diretório de ícones existe
    const iconsDir = path.join(__dirname, '..', 'public', 'icons');
    try {
      await fs.access(iconsDir);
    } catch {
      await fs.mkdir(iconsDir, { recursive: true });
      console.log('📁 Diretório de ícones criado');
    }
    
    for (const size of iconSizes) {
      const iconPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 234, g: 88, b: 12, alpha: 1 } // Cor laranja do tema
        })
        .png()
        .toFile(iconPath);
      
      console.log(`✅ Ícone PWA ${size}x${size} gerado`);
    }
    
    console.log('\n🎉 Atualização completa realizada com sucesso!');
    console.log('\n📁 Arquivos atualizados:');
    console.log('  Favicons:');
    console.log('    - public/favicon-16x16.png');
    console.log('    - public/favicon-32x32.png');
    console.log('    - public/apple-touch-icon.png');
    console.log('    - app/favicon.ico');
    console.log('  Ícones PWA:');
    iconSizes.forEach(size => {
      console.log(`    - public/icons/icon-${size}x${size}.png`);
    });
    
    console.log('\n✨ Agora sua aplicação usa a logo Unindo Destinos em todos os ícones!');
    
  } catch (error) {
    console.error('❌ Erro durante a atualização:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Executar a função
console.log('🔄 Script Master - Atualização Completa de Ícones');
console.log('================================================');

// Força flush do console
process.stdout.write('');

updateAllIcons().then(() => {
  console.log('\n🎯 Script executado com sucesso!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
