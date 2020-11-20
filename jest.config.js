module.exports = {
  globals: {},
  testMatch: ["**.spec.js"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: -5
    }
  },
  collectCoverageFrom: [
    "lib/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/visual-compare.js" //excluding this one because of call back issues
  ]
};
