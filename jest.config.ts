import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          module: "commonjs",
          target: "es2020",
          moduleResolution: "node",
          baseUrl: ".",
          paths: { "@/*": ["src/*"] },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react|framer-motion|@base-ui)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/e2e/"],
};

export default config;
