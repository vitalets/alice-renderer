/**
 * Stryker mutation testing config.
 *
 * To debug particular file:
 * npm run stryker -- -m src/reply.ts
 */

module.exports = {
  mutate: ['src/**/*.ts'],
  packageManager: 'npm',
  reporters: ['clear-text', 'progress'],
  testRunner: 'mocha',
  mochaOptions: {
    spec: ['test/specs/**/*.ts'],
  },
  coverageAnalysis: 'perTest',
  logLevel: 'info',
  thresholds: {
    high: 95,
    low: 95,
    break: 100,
  },
  "buildCommand": "tsc -b",
  "checkers": ["typescript"],
  "tsconfigFile": "stryker.tsconfig.json",
};

