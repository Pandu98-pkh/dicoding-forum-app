module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'linebreak-style': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state',
        'acc', 'accumulator', 'e', 'ctx',
        'req', 'request', 'res', 'response', 'staticContext',
      ],
    }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
    }],
    'import/prefer-default-export': 'off',
    'react/no-danger': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', 'src/test/**/*.{js,jsx}'],
      env: { jest: true },
      globals: { vi: 'readonly' },
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-filename-extension': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off',
      },
    },
    {
      files: ['cypress/**/*.{js,cy.js}', 'cypress.config.js'],
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        expect: 'readonly',
        context: 'readonly',
      },
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
