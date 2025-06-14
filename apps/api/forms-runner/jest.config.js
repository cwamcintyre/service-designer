module.exports = {
  testEnvironment: 'node',
  testMatch: [
    //'**/tests/usecase/**/mojRemoveFromAddAnother.test.ts', // uncomment and change to run specific tests.. DO NOT CHECK IN CHANGES!
    '**/tests/unit/**/*.test.ts',
    '**/tests/usecase/**/*.test.ts'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@model/(.*)$': '<rootDir>/../../../packages/model/$1'
  },
  coveragePathIgnorePatterns: [
    "/tests/"        // Exclude test files
  ]
};