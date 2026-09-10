# Hero refresh — 2026-09-10

Generated with the built-in image_gen tool using the user's reference. The reference was loaded into the conversation because Windows sandbox errors prevented the image tool from reading local paths directly.

Reference URL: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGY3W0U-oVHqJRxd6uK7cz4rL97i46I5rzusAC1ta__bgyhZQ3m7izo9AZ&s=10

## Desktop prompt

Use case: stylized-concept.
Asset type: finished background artwork for a personal website hero, landscape 16:9, target 2560x1440.
Input image 1 is the user's visual reference: a quiet hand-drawn anime cafe interior with a short purple-haired woman wearing a pale apron over a charcoal shirt, softly lit window grid, dark muted green wood paneling, warm beige walls and wooden tables.
Create a polished high-resolution reinterpretation of this reference for an actual website background. Preserve its intimate calm mood, recognizable purple-haired adult woman, green eyes, charcoal shirt and cream apron, softly painted anime rendering and gentle warm indoor light. The character should occupy the RIGHT third, face centered around x=76%, y=42%, upper body visible, naturally leaning slightly toward the viewer; keep her head comfortably inside the frame. Extend the cafe interior across the image with coherent perspective.
Composition: left 58 percent is visually quiet shadowed cafe interior and softly blurred muted olive-green paneling; very little fine detail and no bright window panes behind the title area (x=5–55%, y=25–75%). Place the brighter diffuse window light behind and above the character toward the right. Keep the character visible within the center-right crop used on narrow screens.
Lighting and grading: subdued warm gray, deep forest/olive green, muted plum hair, soft amber-beige highlights; a gentle filmic matte finish and natural depth. Darken left side gracefully by about one stop while keeping shadow detail. The right side is readable and softly illuminated, not blackened. No heavy orange cast, no neon, no harsh bloom, no excessive vignette. The output must already have attractive restrained color grading, with sufficient contrast for off-white webpage text on the left.
No text, lettering, captions, signatures, logos, watermarks, web UI, buttons or borders. No extra people. Do not add rain streaks over the indoor scene. Output one complete background image only, no mockup or collage.

## Mobile prompt

Use case: stylized-concept. Create a portrait 9:16 mobile website hero background variant of the preceding generated cafe artwork, target 1080x1920. Keep the exact same purple-haired adult woman, face identity, green eyes, charcoal top and cream apron, anime illustration rendering, warm muted olive cafe, tables and diffuse window light. Recompose for a narrow phone screen: show the woman smaller and farther away in the UPPER RIGHT, her entire head and face within x=60–90%, y=12–33%. Her seated upper body continues along the right edge. Keep the LEFT and LOWER CENTER (x=0–85%, y=38–85%) a dark softly blurred cafe foreground, suitable for a large off-white two-line heading and subtitle. No face in that text zone. Use coherent natural table perspective in foreground, subtly shaded, no artificial rectangular panels. Window highlights concentrated top right; dark olive wood and subdued warm gray elsewhere, cinematic gentle contrast. Keep shadows detailed, not pitch black; no overly orange filter. Preserve the visual continuity with the supplied landscape version. No text, UI, logos, watermarks, frames, rain or additional people. Output one portrait background image only.

## Files

- hero-desktop.png: generated master, 1672 × 941.
- hero-mobile.png: generated portrait master, 941 × 1672.
- previous-hero.webp and previous-hero-small.webp: previous backgrounds.
- Live output: public/images/hero-rain.webp (desktop) and public/images/hero-rain-small.webp (portrait/mobile).

Only delivery resizing and WebP compression were performed with sharp. Color grading and composition were generated with image_gen; CSS adds text contrast. About and Connect images are unchanged.

## Verification

`npm run test:all` passed with zero Astro errors, warnings or hints. Existing `scripts/verify-intro.mjs` passed against the production preview: desktop and mobile layouts, background loading, native scrolling, crossfades, reduced motion, JavaScript disabled and no runtime errors. Desktop and mobile hero screenshots were visually reviewed.
