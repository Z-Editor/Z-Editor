import { defineConfig as testConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration
const config = defineConfig({
  plugins: [react()],
});

// Vitest configuration
const tstConfig = testConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});

export default {
  ...config,
  ...tstConfig,
};
