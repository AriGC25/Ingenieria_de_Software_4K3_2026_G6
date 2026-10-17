import js from '@eslint/js';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/generated/**', 'docs/**'] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: globals.node },
    rules: { 'no-console': 'error', eqeqeq: 'error', 'no-var': 'error', 'prefer-const': 'error' },
  },
  {
    files: ['backend/src/**/*.js'],
    plugins: { jsdoc },
    rules: { 'jsdoc/check-param-names': 'warn', 'jsdoc/require-param-type': 'warn' },
  },
  {
    files: [
      'backend/src/main.js',
      'backend/database/**/*.js',
      'scripts/**/*.js',
      'backend/scripts/**/*.js',
    ],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['frontend/**/*.{js,jsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.3' } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/tests/**/*.{js,jsx}', 'frontend/vite.config.js', 'backend/vitest.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
