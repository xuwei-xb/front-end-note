const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  rootDir: process.cwd(),
  transform: {
    '^.+\\.(t|j)s?$': ['@swc/jest'],
  },
  moduleDirectories: [
    // 对于 React ReactDOM
    'packages',
    // 对于第三方依赖
    ...defaults.moduleDirectories,
  ],
  testEnvironment: 'jsdom',
  globals: { __DEV__: false },
  setupFilesAfterEnv: ['./scripts/jest/setupJest.js'],
};

