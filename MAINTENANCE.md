# Maintenance

## Pages and content

Only Home (`/`) and CV (`/cv`) are public content pages, plus the shared 404 page.
The former Gallery, Notes, Logs, and standalone Publications routes are preserved
as `.astro.txt` source snapshots in `archive/pages/`; they are not built or served.
Their original Markdown and photographs remain available for recovery.

`src/config/site.ts` contains identity, About paragraphs, interests, current
activities, and contact destinations. Replace `YOUR_EMAIL` and `YOUR_USERNAME` to
activate Email and GitHub; placeholder destinations are never emitted as links.
Home's title and chapter markup live in `src/components/home/IntroSequence.astro`.

`src/config/cv.ts` controls education and research interests. CV also reads all
existing research/project entries from `src/content/work` and
`src/content/publications`, and current activities from `site.ts`.

## Environment assets

`src/config/atmosphere.ts` owns image paths and desktop framing. Each scene has a
desktop WebP and a smaller mobile WebP in `public/images/`. The hero is prioritized;
subsequent images are lazy, asynchronously decoded, and must remain below 350 KB.
Mobile framing is tuned in `src/styles/global.css` so the warm window stays visible.

`design-reference/ASSET-PROMPTS.md` records reference, exact prompts, and the built-in
image generation workflow. To optimize replacement source images:

```sh
node scripts/prepare-atmosphere.mjs hero.png about.png connect.png
```

This only resizes/compresses. It requires `sharp`, supplied by the existing Astro
dependency tree. Originals and the supplied reference are not overwritten.

## Motion and styles

`src/styles/global.css`: environment layers, two CSS rain depths, navigation, CV,
footer, focus, responsive and print treatment.

`src/styles/intro.css`: chapter composition, text reveal, progress markers and
mobile type/spacing. `src/scripts/intro.ts`: IntersectionObserver reveals and
one requestAnimationFrame per scroll update; layout is measured on resize, not
each animation frame. No wheel, touch, or keyboard scroll interception.

## Verification

```sh
npm run test:all
```

The repository has no separate lint command. `test:source` audits Astro/TypeScript
syntax, `astro check` checks types, and `astro build` produces the static site.

For browser checks, open an isolated Chrome with remote debugging on port 9223,
start the production preview on port 4322, then run:

```sh
node scripts/verify-intro.mjs http://127.0.0.1:4322
```

Checks include both pages at 375, 390, 768, 1024, 1440 and 1920 pixels, native wheel
and keyboard scroll, crossfade overlap, reverse reveal, internal links, image
loading, reduced motion, long text and no-JavaScript readability. Screenshots are
saved to the OS temporary directory. No browser testing dependency was added.
