import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import react from 'eslint-plugin-react';

export default tseslint
  .config(
    { ignores: ['dist'] },
    {
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
      settings: { react: { version: '18.3' } },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'simple-import-sort': simpleImportSort,
        react,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
        'react/prop-types': 'off',
      },
    },
    {
      files: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
      },
    },
  )
  .concat(eslintPluginPrettier);
