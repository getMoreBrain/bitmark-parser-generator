module.exports = {
  // testEnvironment: require.resolve('jest-environment-node'),
  // transformIgnorePatterns: [],
  // modulePathIgnorePatterns: [],

  // setupFiles: ['core-js'],

  rootDir: '../../../..',
  roots: ['<rootDir>/src', '<rootDir>/test/custom/generator/expected'],
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 50000,
  testMatch: ['<rootDir>/test/custom/generator/expected/bitmarkGeneratorExpectedTest.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: true,
        isolatedModules: true, // Disable type-checking, otherwise cannot run many error cases
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  reporters: [
    'default',
    [require.resolve('jest-junit'), { outputDirectory: '<rootDir>/test/custom/generator/expected/results' }],
    [
      require.resolve('jest-html-reporter'),
      {
        outputPath: '<rootDir>/test/custom/generator/expected/results/test-report.html',
        pageTitle: 'bitmark-generator Expected Test Report',
        includeFailureMsg: false,
      },
    ],
  ],
  collectCoverageFrom: [
    '<rootDir>/src/model/**/*.{js,ts}',
    '<rootDir>/src/ast/**/*.{js,ts}',
    '<rootDir>/src/parser/json/**/*.{js,ts}',
    // '<rootDir>/src/**/*.{js,ts}'
  ],
};
