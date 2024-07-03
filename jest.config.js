module.exports = {
  preset: '@metamask/snaps-jest',

  // Since `@metamask/snaps-jest` runs in the browser, we can't collect
  // coverage information.
  collectCoverage: false,

  // "resetMocks" resets all mocks, including mocked modules, to jest.fn(),
  // between each test case.
  resetMocks: true,

  // "restoreMocks" restores all mocks created using jest.spyOn to their
  // original implementations, between each test. It does not affect mocked
  // modules.
  restoreMocks: true,

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
              importSource: '@metamask/snaps-sdk',
              useBuiltins: true,
            },
          },
        },
        sourceMaps: false,
      },
    ],
  },
};
