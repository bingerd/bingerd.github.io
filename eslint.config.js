import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        requestAnimationFrame: 'readonly',
        matchMedia: 'readonly',
        navigator: 'readonly',
        HTMLCanvasElement: 'readonly',
        WebGLRenderingContext: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-undef': 'error'
    }
  },
  {
    files: ['js/predictions.js', 'js/main.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        parseFloat: 'readonly',
        parseInt: 'readonly',
        isNaN: 'readonly',
        Math: 'readonly'
      }
    },
    rules: {
      'no-redeclare': 'off'
    }
  }
];
