module.exports = {
  root: true,
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["src/*/"],
    },
  },
  rules: {
    'turbo/no-undeclared-env-vars': 'off',
  }
};
