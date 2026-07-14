import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["packages/atcoder/test/**/*.test.ts"]
  }
});
