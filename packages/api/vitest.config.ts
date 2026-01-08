import { defineConfig } from "vitest/config";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { resolve } from "path";

// Load .env before vitest starts
const env = dotenv.config({ path: resolve(__dirname, ".env") });
dotenvExpand.expand(env);

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    testTimeout: 30000,
    // Ensure tests run sequentially to avoid DB conflicts
    isolate: false,
    fileParallelism: false,
  },
});
