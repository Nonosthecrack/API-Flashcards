import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./tests/globalSetup.js",
    setupFiles: ["./tests/setup.js"],
    env: {
      DB_FILE: "file:./test.db",
      JWT_SECRET: "test_jwt_secret_vitest",
    },
    // Tests sequentiels pour eviter les conflits SQLite
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
    testTimeout: 15000,
  },
});
