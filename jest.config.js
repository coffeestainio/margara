module.exports = {
  globals: {},
  testMatch: ["**.spec.js"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 92,
      statements: -15
    }
  },
  collectCoverageFrom: [
    "lib/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
