/**
 * Stryker mutation testing config.
 *
 * To debug particular file:
 * npm run stryker -- -m src/reply.js
 */

module.exports = function (config) {
  config.set({
    mutate: [
      'src/**/*.js',
      '!src/index.js'
    ],
    mutator: {
      name: 'javascript',
      excludedMutations: [
        'EqualityOperator',
        'ArithmeticOperator',
      ]
    },
    packageManager: 'npm',
    reporters: ['clear-text', 'progress'],
    testRunner: 'mocha',
    mochaOptions: {
      spec: [
        'test/setup.js',
        'test/specs/**/*.js',
      ],
    },
    transpilers: [],
    testFramework: 'mocha',
    coverageAnalysis: 'perTest',
    logLevel: 'info',
    thresholds: {
      high: 95,
      low: 95,
      break: 100
    }
  });
};
