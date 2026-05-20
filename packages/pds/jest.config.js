/** @type {import('jest').Config} */
module.exports = {
  displayName: 'PDS',
  transform: { '^.+\\.(t|j)s$': '@swc/jest' },
  // Jest requires all ESM dependencies to be transpiled (even if they are
  // dynamically import()ed).
  transformIgnorePatterns: [
    `/node_modules/.pnpm/(?!(get-port|lande|toygrad)@)`,
  ],
  testTimeout: 60000,
  setupFiles: ['<rootDir>/../../jest.setup.ts'],
  moduleNameMapper: { '^(\\.\\.?\\/.+)\\.js$': ['$1.ts', '$1.js'] },
  // Sokaa: skip tests for app.bsky.* proxy routes — these forward requests to
  // a Bluesky AppView which does not exist in the Sokaa deployment. The proxy
  // route handlers have been removed; the tests will be replaced with
  // app.sokaa.* equivalents in a follow-up (SOK-34).
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/proxied/'],
}
