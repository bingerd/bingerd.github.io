import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

function readFile(relativePath) {
  return readFileSync(resolve(ROOT, relativePath), 'utf-8');
}

const blogFiles = [
  'docs/blog/2025/webhook-hmac.html',
  'docs/blog/2026/minecraft-server-killswitch.html',
  'docs/blog/2026/intent-classifier-training.html',
  'docs/blog/2026/terraform-load-testing.html',
  'docs/blog/2026/home-cluster-gitops.html',
  'docs/blog/2026/agent-course.html',
  'docs/blog/2026/receipt-agent.html',
  'docs/blog/2026/home-assistant-k8s.html',
  'docs/blog/2026/teaching-cloud-tu-delft.html',
  'docs/blog/2026/atlas-context-engineering.html'
];

const playgroundFiles = [
  'playground/neural-trainer.html',
  'playground/gradient-descent.html',
  'playground/batching-sim.html',
  'playground/token-budget.html',
  'playground/hybrid-search.html'
];

const htmlFiles = [
  'index.html',
  'games/backprop-runner-canyon.html',
  ...playgroundFiles,
  ...blogFiles
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

describe('mermaid diagrams have their renderer', () => {
  for (const file of blogFiles) {
    const content = readFile(file);
    if (content.includes('class="mermaid"')) {
      it(`${file} loads js/mermaid-init.js`, () => {
        assert.ok(content.includes('mermaid-init.js'), `${file} has mermaid diagrams but does not load mermaid-init.js`);
      });
    }
  }

  it('js/mermaid-init.js exists', () => {
    assert.ok(existsSync(resolve(ROOT, 'js/mermaid-init.js')), 'js/mermaid-init.js should exist');
  });
});

describe('blog posts are listed in blog-data.js', () => {
  const blogData = readFileSync(resolve(ROOT, 'js/blog-data.js'), 'utf-8');
  for (const file of blogFiles) {
    it(`${file} appears in the blogPosts array`, () => {
      assert.ok(blogData.includes(file), `${file} should be listed in js/blog-data.js blogPosts`);
    });
  }
});

describe('blog posts load their enhancement scripts', () => {
  for (const file of blogFiles) {
    it(`${file} loads blog-data.js and post-extras.js`, () => {
      const content = readFile(file);
      assert.ok(content.includes('blog-data.js'), `${file} should load blog-data.js`);
      assert.ok(content.includes('post-extras.js'), `${file} should load post-extras.js`);
      assert.ok(content.includes('id="postNav"'), `${file} should have the postNav container`);
    });
  }
});

describe('playground pages link back to the playground', () => {
  for (const file of playgroundFiles) {
    it(`${file} links to index.html#playground`, () => {
      const content = readFile(file);
      assert.ok(content.includes('index.html#playground'), `${file} should link back to the playground section`);
    });
    it(`${file} uses the shared theme script`, () => {
      const content = readFile(file);
      assert.ok(content.includes('js/theme.js'), `${file} should load the shared theme script`);
    });
  }
});

describe('index.html references correct JS files', () => {
  const jsFiles = ['js/blog-data.js', 'js/main.js', 'js/background.js', 'js/easter-eggs.js'];

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
