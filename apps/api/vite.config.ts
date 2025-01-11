import { loadEnv } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  plugins: [tsConfigPaths()],
  test: {
    env: loadEnv(mode, process.cwd(), ''),
  },
}));
