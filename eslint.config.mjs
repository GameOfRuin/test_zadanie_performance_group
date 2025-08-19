import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  eslintConfigPrettier,
  { files: ['**/*.js', '**/*.mjs'] },
  eslintPluginPrettierRecommended,
]);
