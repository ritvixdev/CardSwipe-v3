const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for gesture handler
config.resolver.assetExts.push('bin');

// Enable React Compiler optimizations
config.transformer.minifierConfig = {
  // Enable React Compiler optimizations in production
  keep_fnames: true,
};

module.exports = config;