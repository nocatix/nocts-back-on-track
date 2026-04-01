module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js',
  ],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(expo-secure-store|@react-native-async-storage|expo-sqlite|buffer)/)',
  ],
};
