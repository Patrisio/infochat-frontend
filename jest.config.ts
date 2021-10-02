export default {
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/fileTransformer.js"
  },
  modulePaths: ["src"],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    "^ui(.*)$": "<rootDir>/src/components/$1",
    "^hooks(.*)$": "<rootDir>/src/hooks/$1",
    "^lib(.*)$": "<rootDir>/src/lib/$1",
    "^assets(.*)$": "<rootDir>/src/assets/$1",
    "^api(.*)$": "<rootDir>/src/api/$1",
    "^types(.*)$": "<rootDir>/src/types/$1",
    "^scss(.*)$": "<rootDir>/src/scss/$1",
    "^context(.*)$": "<rootDir>/src/context/$1",
    "^modules(.*)$": "<rootDir>/src/modules/$1",
    "^pages(.*)$": "<rootDir>/src/pages/$1",
    "^store(.*)$": "<rootDir>/src/store/$1",
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
};