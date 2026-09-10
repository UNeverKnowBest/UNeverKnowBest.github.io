# Shinji — a rainy evening

A cinematic, English-language personal website for GitHub Pages. Home tells a
three-part rainy-evening story; CV gathers education, interests, projects and publications.

The visual language pairs blue-green rainy environments with literary serif
typography, mist-lit reflection and restrained amber window light. Scrolling is
native; background crossfades and text reveals work in both directions.

## Stack

- Astro 7.2.9
- Tailwind CSS 4.3.3 via the official Vite plugin
- Astro Content Collections + Zod schemas
- TypeScript 6.0.3
- GitHub Actions + GitHub Pages
- no database
- no client framework required
- a small vanilla TypeScript scroll controller; no animation framework

## First setup

```bash
npm install
npm run dev
```

Before publishing, edit `src/config/site.ts` and replace:

- `YOUR_USERNAME`
- `YOUR_EMAIL@example.com`

Contact placeholders render as inactive rows until real destinations are supplied.
The supplied concept is in `assert/`; optimized atmospheric images are in
`public/images/`. See `design-reference/ASSET-PROMPTS.md` for their provenance.
Former Gallery, Notes, Logs and standalone Publications routes are archived in
`archive/pages/`; only Home, CV and the shared 404 route are built.

## Quality gates

```bash
npm run test:content
npm run check
npm run build
```

Or run everything:

```bash
npm run test:all
```

`test:content` checks collection frontmatter, gallery image paths, alt text, homepage plugin wiring, required routes, and accidental decorative-object assets.

## Deploy as a GitHub personal page

1. Create a repository named `<your-github-username>.github.io`.
2. Push this project to `main`.
3. GitHub → Settings → Pages → Source: **GitHub Actions**.
4. The included deploy workflow builds and publishes automatically.

For a custom domain or project page, add GitHub repository variables `SITE_URL` and (when needed) `BASE_PATH`. The deploy workflow reads those variables automatically.

Astro's official deployment guidance recommends GitHub Actions for GitHub Pages deployments.

## Maintenance

Read `MAINTENANCE.md`. The common tasks are intentionally one-file edits or one-command scaffolds.

## Design rules

Read `DESIGN.md` before adding visual features. It exists to stop future AI-generated changes from drifting back toward a generic developer portfolio.
