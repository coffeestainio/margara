module.exports = {
  globals: {},
  testMatch: ["**.spec.js"],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: -10
    }
  },
  collectCoverageFrom: [
    "lib/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
