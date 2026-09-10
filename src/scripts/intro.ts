/** Three scenes share native document scroll. No wheel/touch/key interception. */
export function initIntro() {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
  const layers = [...document.querySelectorAll<HTMLElement>('[data-atmosphere]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 768px)');
  const nav = [...document.querySelectorAll<HTMLAnchorElement>('.site-header a[href^="#"], .narrative-progress a')];
  const number = document.querySelector<HTMLElement>('[data-chapter-number]');
  let frame = 0;
  let geometry: { top: number; height: number }[] = [];
  let current = -1;
  let observer: IntersectionObserver | undefined;
  const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (value: number) => value * value * (3 - 2 * value);

  function render() {
    frame = 0;
    document.body.toggleAttribute('data-scrolled', scrollY > 32);
    if (!sections.length) return;
    const center = scrollY + innerHeight / 2;
    const centers = geometry.map((item) => item.top + item.height / 2);
    let progress = 0;
    for (let i = 0; i < centers.length - 1; i++) {
      if (center >= centers[i]) progress = i + clamp((center - centers[i]) / (centers[i + 1] - centers[i]));
    }
    const active = Math.round(progress);
    if (active !== current) {
      current = active;
      document.body.dataset.mood = sections[active].dataset.scene;
      nav.forEach((link) => {
        const selected = link.hash === `#${sections[active].id}`;
        link.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      if (number) number.textContent = String(active + 1).padStart(2, '0');
    }
    // Hero is the opaque foundation: incoming layers composite over it, so no black gap.
    layers.forEach((layer, i) => {
      const amount = i === 0 ? 1 : i === 1 ? smooth(clamp(progress)) : smooth(clamp(progress - 1));
      layer.style.opacity = String(amount);
      layer.style.setProperty('--parallax', `${reduced.matches || small.matches ? 0 : clamp((progress - i) * -12, -16, 16)}px`);
    });
    geometry.forEach((item, i) => {
      const distance = (center - (item.top + item.height / 2)) / Math.max(innerHeight, item.height);
      const fade = smooth(clamp((Math.abs(distance) - .22) / .72));
      sections[i].style.setProperty('--copy-opacity', String(reduced.matches ? 1 : 1 - fade * .85));
      sections[i].style.setProperty('--copy-y', `${reduced.matches ? 0 : clamp(-distance * 24, -20, 24)}px`);
      sections[i].style.setProperty('--copy-blur', `${reduced.matches || small.matches ? 0 : fade * 3}px`);
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  function measure() {
    geometry = sections.map((section) => ({ top: section.getBoundingClientRect().top + scrollY, height: section.offsetHeight }));
    schedule();
  }
  function setupMotion() {
    observer?.disconnect();
    document.body.classList.toggle('motion-ready', !reduced.matches);
    if (reduced.matches) sections.forEach((section) => section.classList.add('is-visible'));
    else {
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      }), { threshold: 0, rootMargin: '0px 0px -5% 0px' });
      sections.forEach((section) => observer!.observe(section));
    }
    measure();
  }
  // Close the mobile disclosure after choosing a destination; anchors stay native.
  document.querySelectorAll('.mobile-nav a').forEach((link) => link.addEventListener('click', () => {
    document.querySelector<HTMLDetailsElement>('.mobile-nav')?.removeAttribute('open');
  }));
  // Direct anchors and keyboard focus expose content even before observer delivery.
  document.addEventListener('focusin', (event) => {
    (event.target as HTMLElement).closest('.narrative')?.classList.add('is-visible');
  });
  document.addEventListener('visibilitychange', () => {
    document.body.toggleAttribute('data-paused', document.hidden);
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  reduced.addEventListener('change', setupMotion);
  small.addEventListener('change', measure);
  const resize = new ResizeObserver(measure);
  sections.forEach((section) => resize.observe(section));
  setupMotion();
}
