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
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        clearTimeout: 'readonly',
        matchMedia: 'readonly',
        navigator: 'readonly',
        cancelAnimationFrame: 'readonly',
        localStorage: 'readonly',
        CustomEvent: 'readonly',
        HTMLCanvasElement: 'readonly',
        WebGLRenderingContext: 'readonly',
        IntersectionObserver: 'readonly',
        Date: 'readonly',
        Math: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-undef': 'error'
    }
  },
  {
    files: ['js/predictions.js', 'js/main.js', 'js/easter-eggs.js', 'js/theme.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        parseFloat: 'readonly',
        parseInt: 'readonly',
        isNaN: 'readonly',
        Math: 'readonly',
        Date: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        IntersectionObserver: 'readonly',
        localStorage: 'readonly',
        JSON: 'readonly',
        devicePixelRatio: 'readonly'
      }
    },
    rules: {
      'no-redeclare': 'off'
    }
  }
];
