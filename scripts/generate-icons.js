#!/usr/bin/env node

/**
 * Icon Generation Script for SwipeLearn JS
 * 
 * This script generates all required app icons for iOS and Android
 * from a single source icon (1024x1024 PNG)
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Requirements:
 * - Source icon: assets/icon-source.png (1024x1024)
 * - ImageMagick or similar tool for resizing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Icon sizes for different platforms
const iconSizes = {
  // iOS App Icons
  ios: [
    { size: 20, scale: 1, name: 'icon-20.png' },
    { size: 20, scale: 2, name: 'icon-20@2x.png' },
    { size: 20, scale: 3, name: 'icon-20@3x.png' },
    { size: 29, scale: 1, name: 'icon-29.png' },
    { size: 29, scale: 2, name: 'icon-29@2x.png' },
    { size: 29, scale: 3, name: 'icon-29@3x.png' },
    { size: 40, scale: 1, name: 'icon-40.png' },
    { size: 40, scale: 2, name: 'icon-40@2x.png' },
    { size: 40, scale: 3, name: 'icon-40@3x.png' },
    { size: 60, scale: 2, name: 'icon-60@2x.png' },
    { size: 60, scale: 3, name: 'icon-60@3x.png' },
    { size: 76, scale: 1, name: 'icon-76.png' },
    { size: 76, scale: 2, name: 'icon-76@2x.png' },
    { size: 83.5, scale: 2, name: 'icon-83.5@2x.png' },
    { size: 1024, scale: 1, name: 'icon-1024.png' },
  ],
  
  // Android Icons
  android: [
    { size: 36, density: 'ldpi', name: 'ic_launcher.png' },
    { size: 48, density: 'mdpi', name: 'ic_launcher.png' },
    { size: 72, density: 'hdpi', name: 'ic_launcher.png' },
    { size: 96, density: 'xhdpi', name: 'ic_launcher.png' },
    { size: 144, density: 'xxhdpi', name: 'ic_launcher.png' },
    { size: 192, density: 'xxxhdpi', name: 'ic_launcher.png' },
  ],
  
  // Expo/React Native
  expo: [
    { size: 48, name: 'icon.png' },
    { size: 1024, name: 'icon-1024.png' },
    { size: 512, name: 'adaptive-icon.png' },
    { size: 1024, name: 'splash-icon.png' },
    { size: 32, name: 'favicon.png' },
    { size: 192, name: 'notification-icon.png' },
  ]
};

// Colors for different icon variants
const iconColors = {
  primary: '#2563eb',
  background: '#1e293b',
  foreground: '#ffffff',
};

function checkDependencies() {
  try {
    execSync('convert -version', { stdio: 'ignore' });
    console.log('✅ ImageMagick found');
    return true;
  } catch (error) {
    console.error('❌ ImageMagick not found. Please install ImageMagick:');
    console.error('  macOS: brew install imagemagick');
    console.error('  Ubuntu: sudo apt-get install imagemagick');
    console.error('  Windows: Download from https://imagemagick.org/');
    return false;
  }
}

function createDirectories() {
  const dirs = [
    'assets/images',
    'assets/images/ios',
    'assets/images/android',
    'assets/sounds',
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

function generateIcon(sourceIcon, outputPath, size, options = {}) {
  try {
    let command = `convert "${sourceIcon}" -resize ${size}x${size}`;
    
    // Add background if specified
    if (options.background) {
      command += ` -background "${options.background}" -gravity center -extent ${size}x${size}`;
    }
    
    // Add border radius for rounded icons
    if (options.rounded) {
      const radius = Math.floor(size * 0.2); // 20% radius
      command += ` \\( +clone -threshold -1 -draw "fill black polygon 0,0 0,${radius} ${radius},0 fill white circle ${radius},${radius} ${radius},0" \\( +clone -flip \\) -compose Multiply -composite \\( +clone -flop \\) -compose Multiply -composite \\) +matte -compose CopyOpacity -composite`;
    }
    
    command += ` "${outputPath}"`;
    
    execSync(command, { stdio: 'ignore' });
    console.log(`✅ Generated: ${outputPath} (${size}x${size})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate: ${outputPath}`, error.message);
    return false;
  }
}

function generateSVGIcon() {
  const svgContent = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" rx="180" fill="${iconColors.background}"/>
  
  <!-- Main Icon - JavaScript Symbol with Swipe Gesture -->
  <g transform="translate(512, 512)">
    <!-- JS Background Circle -->
    <circle cx="0" cy="0" r="200" fill="${iconColors.primary}" opacity="0.9"/>
    
    <!-- JS Text -->
    <text x="0" y="20" font-family="Arial, sans-serif" font-size="160" font-weight="bold" 
          text-anchor="middle" fill="${iconColors.foreground}">JS</text>
    
    <!-- Swipe Arrows -->
    <g stroke="${iconColors.foreground}" stroke-width="8" fill="none" opacity="0.8">
      <!-- Left Arrow -->
      <path d="M-280,-80 L-320,-40 L-280,0" stroke-linecap="round"/>
      <line x1="-320" y1="-40" x2="-260" y2="-40"/>
      
      <!-- Right Arrow -->
      <path d="M280,-80 L320,-40 L280,0" stroke-linecap="round"/>
      <line x1="320" y1="-40" x2="260" y2="-40"/>
      
      <!-- Up Arrow -->
      <path d="M-40,-280 L0,-320 L40,-280" stroke-linecap="round"/>
      <line x1="0" y1="-320" x2="0" y2="-260"/>
      
      <!-- Down Arrow -->
      <path d="M-40,280 L0,320 L40,280" stroke-linecap="round"/>
      <line x1="0" y1="320" x2="0" y2="260"/>
    </g>
    
    <!-- Decorative Elements -->
    <g fill="${iconColors.foreground}" opacity="0.6">
      <circle cx="-150" cy="150" r="8"/>
      <circle cx="150" cy="150" r="8"/>
      <circle cx="-150" cy="-150" r="8"/>
      <circle cx="150" cy="-150" r="8"/>
    </g>
  </g>
</svg>`.trim();

  const svgPath = 'assets/icon-source.svg';
  fs.writeFileSync(svgPath, svgContent);
  console.log('✅ Generated source SVG icon');
  
  // Convert SVG to PNG
  try {
    execSync(`convert "${svgPath}" -resize 1024x1024 "assets/icon-source.png"`, { stdio: 'ignore' });
    console.log('✅ Generated source PNG icon (1024x1024)');
    return 'assets/icon-source.png';
  } catch (error) {
    console.error('❌ Failed to convert SVG to PNG:', error.message);
    return null;
  }
}

function generateAllIcons(sourceIcon) {
  let successCount = 0;
  let totalCount = 0;
  
  // Generate Expo icons
  console.log('\n📱 Generating Expo icons...');
  iconSizes.expo.forEach(icon => {
    totalCount++;
    const outputPath = `assets/images/${icon.name}`;
    const options = icon.name.includes('adaptive') ? { background: iconColors.background } : {};
    if (generateIcon(sourceIcon, outputPath, icon.size, options)) {
      successCount++;
    }
  });
  
  // Generate iOS icons
  console.log('\n🍎 Generating iOS icons...');
  iconSizes.ios.forEach(icon => {
    totalCount++;
    const actualSize = Math.round(icon.size * icon.scale);
    const outputPath = `assets/images/ios/${icon.name}`;
    if (generateIcon(sourceIcon, outputPath, actualSize)) {
      successCount++;
    }
  });
  
  // Generate Android icons
  console.log('\n🤖 Generating Android icons...');
  iconSizes.android.forEach(icon => {
    totalCount++;
    const outputPath = `assets/images/android/${icon.density}/${icon.name}`;
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (generateIcon(sourceIcon, outputPath, icon.size)) {
      successCount++;
    }
  });
  
  console.log(`\n📊 Generated ${successCount}/${totalCount} icons successfully`);
  return successCount === totalCount;
}

function generateSplashScreen() {
  console.log('\n🎨 Generating splash screen...');
  
  const splashSvg = `
<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1284" height="2778" fill="${iconColors.background}"/>
  
  <!-- Center Icon -->
  <g transform="translate(642, 1389)">
    <circle cx="0" cy="0" r="120" fill="${iconColors.primary}" opacity="0.9"/>
    <text x="0" y="15" font-family="Arial, sans-serif" font-size="96" font-weight="bold" 
          text-anchor="middle" fill="${iconColors.foreground}">JS</text>
  </g>
  
  <!-- App Name -->
  <text x="642" y="1600" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="${iconColors.foreground}">SwipeLearn JS</text>
  
  <!-- Tagline -->
  <text x="642" y="1660" font-family="Arial, sans-serif" font-size="24" 
        text-anchor="middle" fill="${iconColors.foreground}" opacity="0.8">Master JavaScript in 30 Days</text>
</svg>`.trim();

  fs.writeFileSync('assets/splash-source.svg', splashSvg);
  
  try {
    execSync('convert "assets/splash-source.svg" -resize 1284x2778 "assets/images/splash-screen.png"', { stdio: 'ignore' });
    console.log('✅ Generated splash screen');
    return true;
  } catch (error) {
    console.error('❌ Failed to generate splash screen:', error.message);
    return false;
  }
}

function generateNotificationSound() {
  console.log('\n🔊 Generating notification sound...');
  
  // Create a simple notification sound using sox (if available)
  try {
    execSync('sox -n -r 44100 -c 2 assets/sounds/notification.wav synth 0.3 sine 800 fade 0.1 0.3 0.1', { stdio: 'ignore' });
    console.log('✅ Generated notification sound');
    return true;
  } catch (error) {
    console.log('⚠️  Sox not found, skipping notification sound generation');
    console.log('   You can add a custom notification.wav file to assets/sounds/');
    return false;
  }
}

function main() {
  console.log('🚀 SwipeLearn JS - Icon Generation Script\n');
  
  // Check dependencies
  if (!checkDependencies()) {
    process.exit(1);
  }
  
  // Create directories
  createDirectories();
  
  // Generate source icon if it doesn't exist
  let sourceIcon = 'assets/icon-source.png';
  if (!fs.existsSync(sourceIcon)) {
    console.log('📝 Source icon not found, generating default icon...');
    sourceIcon = generateSVGIcon();
    if (!sourceIcon) {
      console.error('❌ Failed to generate source icon');
      process.exit(1);
    }
  }
  
  // Generate all icons
  const success = generateAllIcons(sourceIcon);
  
  // Generate splash screen
  generateSplashScreen();
  
  // Generate notification sound
  generateNotificationSound();
  
  if (success) {
    console.log('\n🎉 All icons generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review generated icons in assets/images/');
    console.log('2. Customize the source icon if needed');
    console.log('3. Run this script again after making changes');
    console.log('4. Update app.json with correct icon paths');
  } else {
    console.log('\n⚠️  Some icons failed to generate. Check the errors above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateAllIcons, generateSVGIcon };
