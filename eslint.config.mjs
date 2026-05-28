// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: { boundaries },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    settings: {
      'boundaries/elements': [
        { type: 'core',           pattern: 'src/app/core/**' },
        { type: 'shared',         pattern: 'src/app/shared/**' },
        { type: 'domain',         pattern: 'src/app/features/*/domain/**' },
        { type: 'application',    pattern: 'src/app/features/*/application/**' },
        { type: 'infrastructure', pattern: 'src/app/features/*/infrastructure/**' },
        { type: 'presentation',   pattern: 'src/app/features/*/presentation/**' },
        { type: 'app-shell',      pattern: 'src/app/*.ts' },
        { type: 'env',            pattern: 'src/environments/**' },
      ],
      'boundaries/include': ['src/**/*.ts'],
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // Clean Architecture boundaries
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // domain : feuille, ne dépend que de domain (même feature) + core/errors
            { from: 'domain', allow: ['domain', 'core'] },

            // application : domain (même feature) + core
            { from: 'application', allow: ['domain', 'application', 'core'] },

            // infrastructure : implémente domain, peut utiliser core et shared/utils
            { from: 'infrastructure', allow: ['domain', 'infrastructure', 'core', 'shared'] },

            // presentation : ne voit que application/shared/core + sa propre couche
            // ⚠ interdit d'importer infrastructure ailleurs que via providers.ts
            { from: 'presentation', allow: ['application', 'domain', 'shared', 'core', 'presentation'] },

            // core/shared : utilisables partout, ne dépendent que d'eux-mêmes
            { from: 'core', allow: ['core', 'shared'] },
            { from: 'shared', allow: ['shared'] },

            // app shell : tout autorisé (config racine)
            { from: 'app-shell', allow: ['core', 'shared', 'application', 'domain', 'infrastructure', 'presentation', 'env'] },
            { from: 'env', allow: ['core'] },
          ],
        },
      ],

      // interdit explicitement les imports cross-feature
      'boundaries/no-private': ['error', { allowUncles: false }],
    },
  },

  // Exception : seul <feature>.providers.ts a le droit d'importer infrastructure depuis presentation
  {
    files: ['src/app/features/*/presentation/**/*.routes.ts', 'src/app/features/*/infrastructure/*.providers.ts'],
    rules: {
      'boundaries/element-types': 'off',
    },
  },

  // Templates HTML
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },

  // Tests : moins strict
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'boundaries/element-types': 'off',
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**', '.angular/**', 'coverage/**'],
  },
);
