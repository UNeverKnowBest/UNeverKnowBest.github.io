import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    authors: z.array(z.string()),
    venue: z.string(),
    summary: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    links: z
      .object({
        paper: z.string().optional(),
        code: z.string().optional(),
        poster: z.string().optional(),
        project: z.string().optional(),
      })
      .default({}),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    year: z.number(),
    date: z.coerce.date(),
    image: z.string(),
    alt: z.string(),
    category: z.enum(['urban', 'nature', 'travel', 'quiet']),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    aspect: z.enum(['landscape', 'portrait', 'wide']).default('landscape'),
  }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const logs = defineCollection({
  loader: glob({ base: './src/content/logs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    summary: z.string(),
    href: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { publications, gallery, notes, logs, work };
