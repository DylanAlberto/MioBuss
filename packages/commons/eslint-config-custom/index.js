module.exports = {
  extends: ['plugin:react/recommended', 'turbo', 'prettier', 'eslint:recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': [
          'test.{ts,tsx}', // repos with a single test file
          'test-*.{ts,tsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/jest.config.ts', // jest config
          '**/jest.setup.ts', // jest setup
        ],
        'optionalDependencies': false,
      },
    ],
  },
  ignorePatterns: ['**/node_modules/**', 'eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
