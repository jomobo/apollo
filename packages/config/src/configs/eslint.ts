/* eslint-disable no-magic-numbers, sort-keys */

import { ESLintConfig } from '@beemo/driver-eslint';
import fs from 'fs';
import { Path } from '@beemo/core';
import builtinModules from 'builtin-modules';
import { BeemoProcess } from './../types';
import { IGNORE_PATHS, EXTS } from './../constants';

const { tool } = (process.beemo as unknown) as BeemoProcess;
const { node } = tool.config.settings;

const workspacesEnabled = !!tool.package.workspaces;

let project: Path

if (workspacesEnabled) {
  project = Path.resolve('tsconfig.eslint.json');

  const include : Path[] = [];

  tool.getWorkspacePaths({ relative: true }).forEach((wsPath) => {
    include.push(
      new Path(wsPath, 'src/**/*'),
      new Path(wsPath, 'types/**/*')
    );
  });

  fs.writeFileSync(
    project.path(),
    JSON.stringify({
      extends: './tsconfig.options.json',
      include: include.map((i) => i.path()),
    }),
    'utf8'
  );
} else {
  project = Path.resolve('tsconfig.json');
}

const config: ESLintConfig = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'prettier', 'prettier/react', 'prettier/@typescript-eslint'],
  plugins: [
    'babel',
    'compat',
    'node',
    'promise',
    'react-hooks',
    'security',
    'simple-import-sort',
    'unicorn',
  ],
  ignore: [...IGNORE_PATHS, '*.min.js', '*.map'],
  env: {
    browser: true,
  },
  globals: {
    __DEV__: 'readable',
  },
  settings: {
    polyfills: ['promises'],
    'import/extensions': EXTS,
    'import/resolver': {
      node: {
        extensions: EXTS,
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  parserOptions: {
    sourceType: 'module',
    // @ts-expect-error Fix Beemo upstream
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
    },
  },
  reportUnusedDisableDirectives: true,
  rules: {
    'class-methods-use-this': 'off',
    'multiline-comment-style': 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'no-invalid-this': 'off', // Handled by babel/no-invalid-this
    'object-curly-spacing': 'off', // Handled by babel/object-curly-spacing
    // 'padded-blocks': [
    //   'error',
    //   {
    //     // Never apply to blocks
    //     classes: 'never',
    //     switches: 'never',
    //   },
    // ],

    // BABEL
    'babel/new-cap': 'error',
    'babel/no-invalid-this': 'error',
    'babel/object-curly-spacing': ['error', 'always'],
    'babel/semi': 'error',

    // COMPAT
    'compat/compat': node ? 'off' : 'warn',

    // IMPORT
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/prefer-default-export': 'off',

    // PROMISE
    'promise/always-return': 'error',
    'promise/avoid-new': 'off',
    'promise/catch-or-return': 'error',
    'promise/no-callback-in-promise': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'off',
    'promise/no-new-statics': 'error',
    'promise/no-promise-in-callback': 'error',
    'promise/no-return-in-finally': 'error',
    'promise/no-return-wrap': ['error', { allowReject: true }],
    'promise/param-names': 'error',
    'promise/valid-params': 'error',

    // REACT
    'react/sort-prop-types': 'off', // Handled by sort-keys
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-default-props': 'off', // Handled by sort-keys

    // UNICORN
    'unicorn/better-regex': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/empty-brace-spaces': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/explicit-length-check': 'error',
    'unicorn/filename-case': 'off',
    'unicorn/import-index': 'error',
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/no-array-callback-reference': 'error',
    'unicorn/no-console-spaces': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-object-as-default-parameter': 'error',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-unused-properties': 'error',
    'unicorn/no-zero-fractions': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-add-event-listener': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-date-now': 'error',
    'unicorn/prefer-default-parameters': 'error',
    'unicorn/prefer-dom-node-append': 'error',
    'unicorn/prefer-dom-node-remove': 'error',
    'unicorn/prefer-dom-node-text-content': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-keyboard-event-key': 'error',
    'unicorn/prefer-modern-dom-apis': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-trim-start-end': 'error',
    'unicorn/prefer-ternary': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/throw-new-error': 'error',

    // SORT IMPORTS
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          [
            // Side-effects
            '^\\u0000',
            // Node built-ins
            `^(${builtinModules.join('|')})$`,
            // React NPM packages
            '^react',
            // NPM packages
            '^[a-z]',
            // Scoped NPM packages
            '^@[a-z]',
            // Aliased modules
            '^:[a-z]',
            // Parent files
            '^\\.\\./',
            // Sibling files
            '^\\./',
            // Index file
            '^\\.$',
            // Everything else
            '\\*',
          ],
        ],
      },
    ],

    // New and not in Airbnb
    'default-param-last': 'warn',
    'no-constructor-return': 'error',
    'no-dupe-else-if': 'error',
    'no-import-assign': 'error',
    'no-promise-executor-return': 'error',
    'no-setter-return': 'error',
    'no-unreachable-loop': 'error',
    'no-unsafe-optional-chaining': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-regex-literals': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/no-typos': 'error',
    'react/no-unsafe': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',

    // Want to support but disabled in Airbnb
    complexity: ['error', 11],
    'max-lines-per-function': [
      'off',
      {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
    'newline-before-return': 'error',
    'no-constant-condition': 'error',
    'no-div-regex': 'error',
    'no-eq-null': 'error',
    'no-implicit-coercion': 'error',
    'no-loss-of-precision': 'error',
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2, 3],
        ignoreArrayIndexes: true,
        enforceConst: true,
      },
    ],
    'no-native-reassign': 'error',
    'no-negated-condition': 'error',
    'no-useless-call': 'error',
    'require-atomic-updates': 'error',
    'require-unicode-regexp': 'error',
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: false,
        natural: true,
      },
    ],
    'import/default': 'off', // Super slow with TS
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: true,
        allowLiteral: true,
        allowObject: true,
      },
    ],
    'react/forbid-foreign-prop-types': 'error',
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/jsx-key': 'error',
    'react/jsx-no-literals': ['error', { ignoreProps: true }],
    'react/no-did-mount-set-state': 'error',
    'react/no-direct-mutation-state': 'error',

    // Doesnt work with Prettier
    'function-paren-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint'],
      parserOptions: {
        project: project.path(),
      },
      rules: {
        camelcase: 'off',
        'no-unused-vars': 'off',
        'no-void': 'off',
        'import/extensions': [
          'error',
          'never',
          {
            json: 'always',
          },
        ],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': ['error', { default: 'array' }],
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow-as-parameter',
          },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/method-signature-style': 'error',
        '@typescript-eslint/naming-convention': [
          'off', // BUGGY
          { selector: 'variableLike', format: ['camelCase'] },
          { selector: 'memberLike', format: ['camelCase'] },
          { selector: 'typeLike', format: ['PascalCase'] },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          { selector: 'property', format: ['camelCase', 'UPPER_CASE'] },
          { selector: 'enumMember', format: ['camelCase', 'UPPER_CASE'] },
        ],
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidOperator: true }],
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
        '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
        '@typescript-eslint/no-inferrable-types': [
          'error',
          {
            ignoreProperties: true,
            ignoreParameters: true,
          },
        ],
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-parameter-properties': 'error',
        '@typescript-eslint/no-unnecessary-condition': [
          'off', // BUGGY
          { allowConstantLoopConditions: true },
        ],
        '@typescript-eslint/no-unnecessary-qualifier': 'error',
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { vars: 'all', args: 'none', ignoreRestSiblings: true },
        ],
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-var-requires': 'off', // No Babel support
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-readonly': 'off', // Annoying with handlers
        '@typescript-eslint/prefer-reduce-type-parameter': 'error',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/triple-slash-reference': 'error',
        '@typescript-eslint/unified-signatures': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',

        // Doesnt work with TypeScript
        'no-restricted-globals': 'off',
        'no-undef': 'off',
        'import/no-cycle': 'off',
        'import/named': 'off',
        'react/destructuring-assignment': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/no-keyword-prefix': 'off',
        'unicorn/prefer-spread': 'off',
      },
    },
    {
      files: ['*.tsx'],
      plugins: ['@typescript-eslint'],
      rules: {
        'react/sort-comp': [
          'error',
          {
            order: [
              'statics',
              'properties',
              'lifecycle',
              'everything-else',
              'handlers',
              'renderers',
            ],
            groups: {
              statics: ['propTypes', 'defaultProps'],
              properties: [
                '/^(?!on).+$/',
                '/^(?!handle).+$/',
                '/^(?!render).+$/',
                '/^.+Ref$/',
                'state',
              ],
              lifecycle: [
                'constructor',
                'getDerivedStateFromProps',
                'componentDidMount',
                'shouldComponentUpdate',
                'getSnapshotBeforeUpdate',
                'componentDidUpdate',
                'componentDidCatch',
                'componentWillUnmount',
              ],
              handlers: ['/^on.+$/', '/^handle.+$/'],
              renderers: ['/^render.+$/', 'render'],
            },
          },
        ],
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}