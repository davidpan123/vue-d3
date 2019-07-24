module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-multi-spaces': ["error", { ignoreEOLComments: true }],
    'arrow-parens': 0,
    'indent': 0,
    'no-useless-escape': 0,
    'no-invalid-regexp': 2,
    'no-extend-native': 0,
    'spaced-comment': 0,
    'no-trailing-spaces': 0,
    'camelcase': 0,
    'no-unneeded-ternary': 0,
    'one-var': [0],
    'curly': [2, 'multi-or-nest']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
