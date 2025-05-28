// Script para gerar ícones PWA usando Sharp
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const shortcutSizes = [96];

// SVG do ícone principal - Logo da Unindo Destinos
const iconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ea580c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f97316;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="240" fill="url(#gradient)" stroke="#fff" stroke-width="16"/>
  
  <!-- Travel/Connection Icon -->
  <!-- Airplane -->
  <g transform="translate(256,256)">
    <!-- Wings -->
    <path d="M-120,-40 L-40,-20 L40,-20 L120,-40 L120,-20 L40,0 L-40,0 L-120,-20 Z" 
          fill="#fff" opacity="0.9"/>
    <!-- Body -->
    <rect x="-80" y="-8" width="160" height="16" rx="8" fill="#fff"/>
    <!-- Tail -->
    <path d="M80,-8 L120,-20 L120,20 L80,8 Z" fill="#fff" opacity="0.8"/>
    <!-- Front -->
    <circle cx="-80" cy="0" r="12" fill="#fff"/>
  </g>
  
  <!-- Connection Points -->
  <circle cx="150" cy="150" r="20" fill="#fff" opacity="0.8"/>
  <circle cx="362" cy="150" r="20" fill="#fff" opacity="0.8"/>
  <circle cx="256" cy="400" r="20" fill="#fff" opacity="0.8"/>
  
  <!-- Connection Lines -->
  <line x1="150" y1="150" x2="256" y2="256" stroke="#fff" stroke-width="4" opacity="0.6"/>
  <line x1="362" y1="150" x2="256" y2="256" stroke="#fff" stroke-width="4" opacity="0.6"/>
  <line x1="256" y1="400" x2="256" y2="256" stroke="#fff" stroke-width="4" opacity="0.6"/>
</svg>
`;

// SVG para shortcuts
const peopleIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#ea580c" rx="12"/>
  <g transform="translate(48,48)" fill="#fff">
    <!-- Pessoas -->
    <circle cx="-15" cy="-10" r="8"/>
    <circle cx="15" cy="-10" r="8"/>
    <rect x="-23" y="2" width="16" height="20" rx="8"/>
    <rect x="7" y="2" width="16" height="20" rx="8"/>
  </g>
</svg>
`;

const travelIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#ea580c" rx="12"/>
  <g transform="translate(48,48)" fill="#fff">
    <!-- Mala de viagem -->
    <rect x="-20" y="-10" width="40" height="25" rx="4" fill="none" stroke="#fff" stroke-width="3"/>
    <rect x="-15" y="-15" width="30" height="5" rx="2"/>
    <circle cx="-12" cy="20" r="4"/>
    <circle cx="12" cy="20" r="4"/>
  </g>
</svg>
`;

const profileIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#ea580c" rx="12"/>
  <g transform="translate(48,48)" fill="#fff">
    <!-- Perfil -->
    <circle cx="0" cy="-8" r="12"/>
    <path d="M-20,15 Q-20,5 0,5 Q20,5 20,15 L20,20 L-20,20 Z"/>
  </g>
</svg>
`;

async function generateIcon(svgContent, size, filename) {
  try {
    const buffer = Buffer.from(svgContent);
    await sharp(buffer)
      .resize(size, size)
      .png()
      .toFile(filename);
    console.log(`✅ Gerado: ${filename}`);
  } catch (error) {
    console.error(`❌ Erro ao gerar ${filename}:`, error);
  }
}

async function generateAllIcons() {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  
  try {
    // Criar diretório de ícones se não existir
    await fs.mkdir(iconsDir, { recursive: true });
    
    // Gerar ícones principais
    for (const size of iconSizes) {
      await generateIcon(iconSVG, size, path.join(iconsDir, `icon-${size}x${size}.png`));
    }
    
    // Gerar ícones de shortcuts
    await generateIcon(peopleIconSVG, 96, path.join(iconsDir, 'shortcut-people.png'));
    await generateIcon(travelIconSVG, 96, path.join(iconsDir, 'shortcut-travel.png'));
    await generateIcon(profileIconSVG, 96, path.join(iconsDir, 'shortcut-profile.png'));
    
    // Gerar favicon
    await generateIcon(iconSVG, 32, path.join(__dirname, '..', 'public', 'favicon.ico'));
    
    console.log('\n🎉 Todos os ícones foram gerados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar diretório ou gerar ícones:', error);
  }
}

// Verificar se Sharp está instalado
(async () => {
  try {
    await generateAllIcons();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('📦 Sharp não encontrado. Instalando...');
      console.log('Execute: npm install sharp --save-dev');
      console.log('Depois execute: node scripts/generate-icons.js');
    } else {
      console.error('❌ Erro:', error);
    }
  }
})();
