const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add support for Node.js core modules in React Native
defaultConfig.resolver.extraNodeModules = {
  buffer: require.resolve('buffer'),
};

module.exports = defaultConfig;

