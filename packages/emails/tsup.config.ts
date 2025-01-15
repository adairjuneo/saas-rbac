import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: [
    './src/recovery-password.tsx',
    './src/reset-password-successfully.tsx',
  ],
  format: ['cjs', 'esm'],
  external: ['react'],
  banner: {
    js: "'use client'",
  },
  ...options,
}));
