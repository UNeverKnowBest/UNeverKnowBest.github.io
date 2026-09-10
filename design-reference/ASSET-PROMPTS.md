# Atmospheric assets

Reference: `assert/d6b68385-226c-45d3-916f-da97442ad6a8.png`, supplied by the user.
Method: built-in `image_gen` image editing tool, one call for each scene, with the
reference passed via `referenced_image_paths`. No CLI/API fallback was used.
Original reference was not modified. The output was reviewed before delivery.

Final assets: `public/images/hero-rain.webp`, `public/images/about-rain.webp`,
`public/images/connect-rain.webp`, plus a `-small.webp` version of each. Desktop
images are 1672 × 941; mobile delivery images are 960 × 540. WebP conversion only
resized/compressed the generated images using `scripts/prepare-atmosphere.mjs`.

## Exact prompt construction

Each prompt is the following prefix, its scene paragraph, and the common suffix,
joined with spaces.

Prefix:

> Use case: precise-object-edit / website atmospheric background. Input image is an existing three-panel website concept. Create ONE seamless landscape 16:9 background image derived from the specified panel, NOT a website mockup, not a collage.

Hero scene paragraph:

> TOP THIRD ONLY: rainy dark blue-green urban garden footpath, foreground leafy frame, distant commuter train, wet stone reflections, a distant person with umbrella at right. Retain general mood and scene. Remove the Japanese sign entirely and use unmarked neutral contemporary infrastructure, no Japanese-specific architecture. Extend horizontally for a 16:9 composition with quiet dark negative space on left half for real website text. Tiny warm distant light only.

About scene paragraph:

> MIDDLE THIRD ONLY: view from beneath a simple contemporary timber and stone shelter into a misty rainy green garden, pale diffused grey-green light, wet surfaces, foreground soft leaves, simple vertical timber post on right. Remove the cup and visible umbrella. No traditional Japanese architecture, props or signage. Extend horizontally into a 16:9 image, left 65 percent is luminous muted pale mist and soft greenery, uncluttered enough for dark editorial text. Retain lush garden atmosphere.

Connect scene paragraph:

> BOTTOM THIRD ONLY: rainy evening footpath alongside simple contemporary wood and glass windows at right, warm amber interior light and narrow reflected golden light on wet paving, dark lush greenery foreground at left. Keep warm light limited to small window area and reflections (under ten percent of frame). Replace any paper lantern with a small neutral contemporary interior lamp, no overt Japanese architecture. Extend to 16:9 with calm dark blue-green negative space at left for real website copy.

Suffix:

> Remove ALL text, letters, navigation, numbers, UI, arrows, icons, signatures and watermark-like marks. Preserve the reference's cinematic, naturalistic painterly rain, depth and subdued color. Do not recreate film frames or recognizable characters. Output only the clean environment image, approximately 1920x1080.
