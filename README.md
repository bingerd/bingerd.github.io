# bingerd.github.io

Personal portfolio site for **Bing Tan** — Machine Learning Engineer.

**Live at [bngrd.com](https://bngrd.com)**

## What's here

- Portfolio with case studies, tech stack, and project highlights
- Interactive 3D background (Three.js) with chaos mode
- **Backprop Runner** — a 3D endless runner game themed around gradient descent (Three.js + Rapier physics)
- **ML Playground** — 5 real interactive ML demos (neural trainer, gradient descent, batching simulator, token budget, hybrid search), all vanilla JS + canvas
- 10 blog posts grounded in real projects: on-device AI, agentic systems, MLOps, homelab GitOps, cloud cost tricks, and webhook security

## Tech stack

- **Zero build step** — pure static HTML/CSS/JS, deployed directly via GitHub Pages
- **Three.js** (v0.160) — 3D graphics and custom GLSL shaders
- **Rapier 3D** — physics engine for the game
- **Vanilla JS** — no frameworks, no bundlers
- **Mermaid** (v11, CDN, loaded lazily) — architecture diagrams in blog posts
- **highlight.js** (v11, CDN, loaded lazily) — syntax highlighting in blog posts
- **ESLint + Node test runner** — dev-only quality tools

## Project structure

```
.
├── index.html                          # Main portfolio page
├── css/
│   ├── style.css                       # Main site styles
│   └── blog.css                        # Shared blog post styles
├── js/
│   ├── theme.js                        # Shared dark/light theme (persisted)
│   ├── blog-data.js                    # Blog post metadata (index grid + prev/next nav)
│   ├── post-extras.js                  # Syntax highlighting, copy buttons, progress bar, prev/next
│   ├── background.js                   # Three.js 3D background (classic script, dynamic-imports three.js so file:// works)
│   └── main.js                         # Blog rendering and utilities
├── games/
│   └── backprop-runner-canyon.html      # Backprop Runner game
├── playground/                         # Interactive ML demos (neural-trainer, gradient-descent, ...)
├── docs/blog/                          # Blog posts (by year)
│   ├── 2025/webhook-hmac.html
│   └── 2026/                           # atlas-context-engineering, agent-course, receipt-agent, ...
├── tests/
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
npm test           # Run all tests
```

## Adding a blog post

1. Create a new HTML file in `docs/blog/2026/`
2. Link the shared stylesheet: `<link rel="stylesheet" href="../../../css/blog.css" />`
3. Add the post to the `blogPosts` array in `js/blog-data.js`
4. Push to `main` — GitHub Pages deploys automatically

## Deployment

Push to `main` branch. GitHub Pages auto-deploys to [bngrd.com](https://bngrd.com).
