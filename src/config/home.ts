export type HomeSection = {
  id: string;
  enabled: boolean;
};

/**
 * Homepage plugin switchboard.
 * - Reorder objects to reorder sections.
 * - Set enabled: false to hide a section.
 * - To add a plugin: create src/components/home/plugins/<id>.astro,
 *   then add { id: '<id>', enabled: true } here.
 */
export const homeSections: HomeSection[] = [
  { id: 'about', enabled: true },
  { id: 'currently', enabled: false },
  { id: 'selected-work', enabled: true },
  { id: 'publications', enabled: true },
  { id: 'recent-notes', enabled: false },
  { id: 'gallery-preview', enabled: false },
];
