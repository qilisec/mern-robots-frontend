module.exports = {
  extends: ['wesbos'],
  env: {
    es6: true,
    browser: true,
  },
  plugins: ['only-warn', 'import'],
  rules: {
    'react/prop-types': 1,
    'no-unused-vars': 0,
    'arrow-body-style': 0,
    'import/no-extraneous-dependencies': [
      'warn',
      // {
      //   devDependencies: false,
      //   optionalDependencies: false,
      //   peerDependencies: false,
      //   packageDir: __dirname,
      // },
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: true,
        packageDir: __dirname,
      },
    ],
  },
};
