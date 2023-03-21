module.exports = {
  // testEnvironment: require.resolve('jest-environment-node'),
  // transformIgnorePatterns: [],
  // modulePathIgnorePatterns: [],

  // setupFiles: ['core-js'],

  testEnvironment: 'node',
  verbose: true,
  testTimeout: 50000,
  testMatch: ['<rootDir>/test/bmgBookTest.ts'],
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
    [require.resolve('jest-junit'), { outputDirectory: '<rootDir>/test/results' }],
    [
      require.resolve('jest-html-reporter'),
      {
        outputPath: './test/results/test-report-books.html',
        pageTitle: 'bitmark-generator Books Test Report',
        includeFailureMsg: false,
      },
    ],
  ],
  // collectCoverageFrom: ['src/**/*.{js,ts}', '!<rootDir>/node_modules/', '!<rootDir>/path/to/dir/'],
};
