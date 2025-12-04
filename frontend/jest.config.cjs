module.exports = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
