import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import replace from '@rollup/plugin-replace';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    replace({
      __DEV__: true,
      preventAssignment: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: 'react',
        replacement: path.resolve(__dirname, '../packages/react'),
      },
      {
        find: 'react-dom',
        replacement: path.resolve(__dirname, '../packages/react-dom'),
      },
    ],
  },
});

