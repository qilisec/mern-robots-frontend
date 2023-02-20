module.exports = {
  extends: ['wesbos'],
  env: {
    es6: true,
    browser: true,
  },
  overrides: [
    {
      files: ['*.js', '*.ts'],
      extends: ['wesbos'],
      rules: {
        'react/prop-types': 1,
      },
    },
  ],
};
