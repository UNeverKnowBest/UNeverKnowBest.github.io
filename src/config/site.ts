export const site = {
  name: 'Shinji Yu',
  title: 'Shinji Yu — a quiet corner of the internet',
  description:
    'Research, quiet reflection, and a little connection. The personal website of Shinji Yu.',
  language: 'en',
  hero: {
    eyebrow: 'A quiet corner of the internet',
    title: 'Good to see you here.',
    subtitle: 'Stay for a little while.',
    note: 'Research · Coffee · Psychology',
  },
  about: [
    'I’m Shinji(昕霁). I study artificial intelligence and spend a lot of time thinking about how intelligent systems reason, remember, and interact with people.',
    'Outside of research, I like coffee, reading books beyond my field, quiet walks.',
  ],
  currently: [
    { label: 'learning', value: 'Agent runtime, Multi-agents system' },
  ],
  avatar: {
    enabled: false,
    src: '/avatar.png',
    alt: 'Illustrated avatar of Shinji Yu',
  },
  social: [
    { label: 'Email', href: 'mailto:YOUR_EMAIL@example.com' },
    { label: 'GitHub', href: 'https://github.com/UNeverKnowBest' },
  ],
  footer: 'Thanks for being here. See you around.',
} as const;

// Missing contact details stay in configuration, never become fabricated public URLs.
export const contactLinks = site.social.filter((link) => !/YOUR_|example\.com/i.test(link.href));

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'CV', href: '/cv' },
] as const;
