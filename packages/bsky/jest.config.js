/** @type {import('jest').Config} */
module.exports = {
  displayName: 'Bsky App View',
  transform: { '^.+\\.(t|j)s$': '@swc/jest' },
  transformIgnorePatterns: ['/node_modules/.pnpm/(?!(get-port)@)'],
  testTimeout: 60000,
  setupFiles: ['<rootDir>/../../jest.setup.ts'],
  moduleNameMapper: { '^(\\.\\.?\\/.+)\\.js$': ['$1.ts', '$1.js'] },
  // Sokaa: skip bsky-specific tests that are flaky or depend on bsky AppView behavior.
  // These will be replaced with app.sokaa.* equivalents in later phases (SOK-34+).
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/views/thread.test.ts'],
}
