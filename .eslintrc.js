module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['plugin:prettier/recommended', 'plugin:react/recommended', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: { 'no-nested-ternary': 'off' },
};
