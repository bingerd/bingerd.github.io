import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

function readFile(relativePath) {
  return readFileSync(resolve(ROOT, relativePath), 'utf-8');
}

const htmlFiles = [
  'index.html',
  'games/backprop-runner-canyon.html',
  'animations/neural-field-particles.html',
  'docs/blog/2026/ml-production.html',
  'docs/blog/2026/mlops-lessons.html',
  'docs/blog/2026/rust-torch-serving.html',
  'docs/blog/2026/transformers-kv-caching.html'
];

describe('HTML structure validation', () => {
  for (const file of htmlFiles) {
    describe(file, () => {
      const content = readFile(file);

      it('has lang attribute on html tag', () => {
        assert.ok(content.includes('<html lang='), `${file} is missing lang attribute`);
      });

      it('has a <title> tag', () => {
        assert.ok(content.includes('<title>'), `${file} is missing <title>`);
      });

      it('has viewport meta tag', () => {
        assert.ok(content.includes('viewport'), `${file} is missing viewport meta`);
      });

      it('has a charset declaration', () => {
        assert.ok(
          content.includes('charset="UTF-8"') || content.includes('charset=UTF-8'),
          `${file} is missing charset`
        );
      });
    });
  }
});

describe('blog posts use shared stylesheet', () => {
  const blogFiles = [
    'docs/blog/2026/ml-production.html',
    'docs/blog/2026/mlops-lessons.html',
    'docs/blog/2026/rust-torch-serving.html',
    'docs/blog/2026/transformers-kv-caching.html'
  ];

  for (const file of blogFiles) {
    it(`${file} links to blog.css`, () => {
      const content = readFile(file);
      assert.ok(content.includes('blog.css'), `${file} should link to shared blog.css`);
    });

    it(`${file} does not have inline <style> blocks`, () => {
      const content = readFile(file);
      assert.ok(!content.includes('<style>'), `${file} should not have inline styles`);
    });
  }
});

describe('mlops-lessons.html has unique content', () => {
  it('differs from ml-production.html', () => {
    const mlProd = readFile('docs/blog/2026/ml-production.html');
    const mlOps = readFile('docs/blog/2026/mlops-lessons.html');
    assert.notEqual(mlProd, mlOps, 'mlops-lessons.html should have different content from ml-production.html');
  });

  it('has its own title', () => {
    const content = readFile('docs/blog/2026/mlops-lessons.html');
    assert.ok(content.includes('MLOps Lessons'), 'mlops-lessons.html should have MLOps-specific title');
  });
});

describe('index.html references correct JS files', () => {
  const jsFiles = ['js/predictions.js', 'js/main.js', 'js/background.js'];

  for (const jsFile of jsFiles) {
    it(`${jsFile} exists on disk`, () => {
      assert.ok(existsSync(resolve(ROOT, jsFile)), `${jsFile} should exist`);
    });
  }

  it('index.html references all JS files', () => {
    const content = readFile('index.html');
    for (const jsFile of jsFiles) {
      assert.ok(content.includes(jsFile), `index.html should reference ${jsFile}`);
    }
  });
});

describe('index.html references external stylesheet', () => {
  it('links to css/style.css', () => {
    const content = readFile('index.html');
    assert.ok(content.includes('css/style.css'), 'index.html should link to css/style.css');
  });

  it('css/style.css exists', () => {
    assert.ok(existsSync(resolve(ROOT, 'css/style.css')), 'css/style.css should exist');
  });

  it('css/blog.css exists', () => {
    assert.ok(existsSync(resolve(ROOT, 'css/blog.css')), 'css/blog.css should exist');
  });
});

describe('accessibility basics', () => {
  it('index.html has a skip link', () => {
    const content = readFile('index.html');
    assert.ok(content.includes('skip-link'), 'index.html should have a skip-to-content link');
  });

  it('index.html has nav with aria-label', () => {
    const content = readFile('index.html');
    assert.ok(content.includes('aria-label="Main navigation"'), 'nav should have aria-label');
  });

  it('index.html has a <main> element', () => {
    const content = readFile('index.html');
    assert.ok(content.includes('<main>'), 'index.html should have a <main> element');
  });

  it('index.html canvas is aria-hidden', () => {
    const content = readFile('index.html');
    assert.ok(content.includes('aria-hidden="true"'), 'decorative canvas should be aria-hidden');
  });
});
