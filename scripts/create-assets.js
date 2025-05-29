#!/usr/bin/env node

/**
 * Create basic app assets for Expo build
 * This creates simple colored squares as placeholders for icons
 */

const fs = require('fs');
const path = require('path');

// Create assets directory
const assetsDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple SVG icon
const createSVGIcon = (size, backgroundColor = '#2563eb', foregroundColor = '#ffffff') => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${backgroundColor}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" 
        text-anchor="middle" dominant-baseline="central" fill="${foregroundColor}">JS</text>
</svg>`;
};

// Create a simple splash screen SVG
const createSplashSVG = () => {
  return `<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
  <rect width="1284" height="2778" fill="#1e293b"/>
  <g transform="translate(642, 1389)">
    <circle cx="0" cy="0" r="120" fill="#2563eb"/>
    <text x="0" y="15" font-family="Arial, sans-serif" font-size="96" font-weight="bold" 
          text-anchor="middle" fill="#ffffff">JS</text>
  </g>
  <text x="642" y="1600" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="#ffffff">SwipeLearn JS</text>
</svg>`;
};

// Function to convert SVG to a simple base64 PNG (placeholder)
const createPlaceholderPNG = (size) => {
  // This is a minimal 1x1 transparent PNG in base64
  const transparentPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  return Buffer.from(transparentPNG, 'base64');
};

// Create required asset files
const assets = [
  { name: 'icon.png', size: 1024 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'splash-icon.png', size: 1284 },
  { name: 'favicon.png', size: 32 },
];

console.log('Creating basic app assets...');

// Create SVG files first
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), createSVGIcon(1024));
fs.writeFileSync(path.join(assetsDir, 'splash.svg'), createSplashSVG());

// Create placeholder PNG files
assets.forEach(asset => {
  const filePath = path.join(assetsDir, asset.name);
  const pngData = createPlaceholderPNG(asset.size);
  fs.writeFileSync(filePath, pngData);
  console.log(`✅ Created ${asset.name}`);
});

console.log('\n📁 Assets created in:', assetsDir);
console.log('\n⚠️  Note: These are placeholder assets. For production, replace with:');
console.log('   - High-quality app icons (1024x1024 PNG)');
console.log('   - Proper splash screen images');
console.log('   - Favicon for web');
console.log('\n🎨 You can use the SVG files as templates and convert them to PNG using:');
console.log('   - Online converters (e.g., convertio.co)');
console.log('   - Design tools (Figma, Sketch, Photoshop)');
console.log('   - Command line tools (ImageMagick, Inkscape)');

console.log('\n✅ Assets ready for Expo build!');
