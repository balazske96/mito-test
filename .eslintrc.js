module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@nuxtjs/eslint-config-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Express.js specific rules
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',

    // Vue/Nuxt specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
  },
  overrides: [
    // Express.js backend specific rules
    {
      files: ['apps/api/**/*', 'packages/**/server/**/*'],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        'no-console': 'off', // Allow console.log in backend
      },
    },
    // Nuxt.js frontend specific rules
    {
      files: ['apps/web/**/*', 'packages/**/client/**/*'],
      extends: ['@nuxtjs/eslint-config-typescript'],
      env: {
        browser: true,
        node: false,
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    '.nuxt/',
    '.output/',
  ],
};
