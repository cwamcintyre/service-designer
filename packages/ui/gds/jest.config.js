module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    //'**/tests/unit/**/datePartsHandler.test.ts', // uncomment and change to run specific tests.. DO NOT CHECK IN CHANGES!
    '**/tests/*.test.tsx',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@model/(.*)$': '<rootDir>/../../../packages/model/$1'
  },
};