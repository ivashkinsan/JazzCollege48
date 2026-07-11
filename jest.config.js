module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "src",
  "testRegex": ".*\.spec\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "globals": {
    "ts-jest": {
      "tsconfig": "tsconfig.node.json"
    }
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
