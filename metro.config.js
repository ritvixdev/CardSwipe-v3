const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for gesture handler
config.resolver.assetExts.push('bin');

module.exports = config;