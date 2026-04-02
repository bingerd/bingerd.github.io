# bingerd.github.io

Personal portfolio site for **Bing Tan** — Machine Learning Engineer.

**Live at [bngrd.com](https://bngrd.com)**

## What's here

- Portfolio with case studies, tech stack, and project highlights
- Interactive 3D background (Three.js) with chaos mode
- **Backprop Runner** — a 3D endless runner game themed around gradient descent (Three.js + Rapier physics)
- **Neural Field Particles** — 8,000 particles advected through a continuous vector field
- **ML Playground** — 10 fun prediction endpoints (shorts weather, coffee need, LLM sanity check, etc.)
- Blog posts on ML systems, MLOps, transformers, and Rust-based serving

## Tech stack

- **Zero build step** — pure static HTML/CSS/JS, deployed directly via GitHub Pages
- **Three.js** (v0.160) — 3D graphics and custom GLSL shaders
- **Rapier 3D** — physics engine for the game
- **Vanilla JS** — no frameworks, no bundlers
- **ESLint + Node test runner** — dev-only quality tools

## Project structure

```
.
├── index.html                          # Main portfolio page
├── css/
│   ├── style.css                       # Main site styles
│   └── blog.css                        # Shared blog post styles
├── js/
│   ├── background.js                   # Three.js 3D background (ES module)
│   ├── predictions.js                  # ML playground endpoint logic
│   ├── prediction-logic.js             # Pure computation functions (testable)
│   └── main.js                         # Blog rendering and utilities
├── games/
│   └── backprop-runner-canyon.html      # Backprop Runner game
├── animations/
│   └── neural-field-particles.html     # Particle field visualization
├── docs/blog/2026/                     # Blog posts
│   ├── ml-production.html
│   ├── mlops-lessons.html
│   ├── rust-torch-serving.html
│   └── transformers-kv-caching.html
├── tests/
│   ├── predictions.test.js             # Unit tests for prediction logic
│   └── validate-html.test.js           # Structural validation tests
├── .github/workflows/ci.yml           # CI: lint + test on push/PR
├── package.json                        # Dev dependencies only
├── eslint.config.js                    # ESLint v9 flat config
└── CNAME                              # Custom domain (bngrd.com)
```

## Local development

The site is fully static — just open `index.html` in a browser. No server needed.

For dev tools (linting, testing):

```bash
npm install        # Install dev dependencies
npm run lint       # ESLint on js/
npm test           # Run all tests (69 tests)
```

## Adding a blog post

1. Create a new HTML file in `docs/blog/2026/`
2. Link the shared stylesheet: `<link rel="stylesheet" href="../../../css/blog.css" />`
3. Add the post to the `blogPosts` array in `js/main.js`
4. Push to `main` — GitHub Pages deploys automatically

## Deployment

Push to `main` branch. GitHub Pages auto-deploys to [bngrd.com](https://bngrd.com).
