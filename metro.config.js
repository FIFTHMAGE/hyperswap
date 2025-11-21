const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push('db', 'bin');
config.resolver.sourceExts.push('cjs', 'mjs');

module.exports = config;
