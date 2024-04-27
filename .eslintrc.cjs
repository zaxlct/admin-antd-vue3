/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    '@vanwei/eslint-config/vue3',
    '@vanwei/eslint-config/typescript',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
    // '@vue/eslint-config-prettier/skip-formatting',
    './.eslintrc-auto-import.json'
  ],
  globals: {
    Iconfont: true,
    __APP_CONFIG__: true
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        'space-before-function-paren': false
      },
      {
        fileInfoOptions: {
          withNodeModules: true
        }
      }
    ],
    'vue/no-setup-props-destructure': 0,
    'vue/no-dupe-keys': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 1,
    // name命名规则interface\typeAlias\class\enum需用大驼峰，属性用小驼峰
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['interface', 'typeAlias', 'class', 'enum'],
        format: ['PascalCase']
      }
    ],
    semi: ['error', 'never']
  }
};
