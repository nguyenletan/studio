module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
    'prettier', // Make sure this is last to override other configs
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/prop-types': 'off', // Use TypeScript for prop validation
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',

    // Import rules
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
  },
  overrides: [
    // Specific rules for Next.js pages and API routes
    {
      files: ['src/app/**/*.tsx', 'src/app/**/*.ts', 'src/pages/**/*.tsx', 'src/pages/**/*.ts'],
      rules: {
        'import/no-default-export': 'off', // Allow default exports in pages
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/',
    '**/*.d.ts',
    'next.config.js',
    'next.config.ts',
    'postcss.config.js',
    'tailwind.config.js',
    'tailwind.config.ts',
  ],
};
