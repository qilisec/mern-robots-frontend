module.exports = {
  extends: ['wesbos'],
  env: {
    es6: true,
    browser: true,
  },
  plugins: ['only-warn'],
  rules: {
    'react/prop-types': 1,
    'no-unused-vars': 0,
  },
};
