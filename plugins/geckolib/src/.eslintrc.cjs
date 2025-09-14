/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    browser: true,
    es2015: true,
    jquery: true
  },
  rules: {
    'prefer-rest-params': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};