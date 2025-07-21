module.exports = {
  // testEnvironment: require.resolve('jest-environment-node'),
  // transformIgnorePatterns: [],
  // modulePathIgnorePatterns: [],

  // setupFiles: ['core-js'],

  testEnvironment: 'node',
  verbose: true,
  testTimeout: 50000,
  testMatch: ['<rootDir>/test/standard/**/*.test.ts', '<rootDir>/test/breakscape/**/*.test.ts'],
  // testMatch: ['<rootDir>/test/standard/**/*.test.ts'],
  // testMatch: ['<rootDir>/test/breakscape/**/*.test.ts'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'ts-jest',
      {
        diagnostics: true,
        isolatedModules: true, // Disable type-checking, otherwise cannot run many error cases
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@gmb/bitmark-breakscape)', // allow transpiling this package
  ],
  reporters: [
    'default',
    [require.resolve('jest-junit'), { outputDirectory: '<rootDir>/test/standard/results' }],
    [
      require.resolve('jest-html-reporter'),
      {
        outputPath: '<rootDir>/test/standard/results/test-report.html',
        pageTitle: 'bitmark-parser-generator Test Report',
        includeFailureMsg: false,
      },
    ],
  ],
  // collectCoverageFrom: ['src/**/*.{js,ts}', '!<rootDir>/node_modules/', '!<rootDir>/path/to/dir/'],
};
