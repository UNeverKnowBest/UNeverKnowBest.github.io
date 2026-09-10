// Browser integration check. Run a Chrome instance with --remote-debugging-port=9223
// and the site's preview server, then: node scripts/verify-intro.mjs [site URL]
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:4322';
const pages = await fetch('http://127.0.0.1:9223/json/list').then((r) => r.json());
const page = pages.find((item) => item.type === 'page');
assert.ok(page, 'Chrome must have an open page');
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
const errors = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  const request = pending.get(message.id);
  if (request) {
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  }
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const state = () => evaluate(`({ active: document.body.dataset.mood, y: scrollY, overflow: document.documentElement.scrollWidth > innerWidth, layers: [...document.querySelectorAll('[data-atmosphere]')].map(e=>Number(getComputedStyle(e).opacity)) })`);
const viewport = (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
async function wheel(deltaY) {
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 600, y: 400, deltaX: 0, deltaY });
}
async function goHome() {
  await send('Page.navigate', { url: base });
  await pause(1500);
}
async function screenshot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png' });
  const file = join(tmpdir(), `personal-web-intro-${name}.png`);
  await writeFile(file, Buffer.from(result.data, 'base64'));
  console.log(`Screenshot: ${file}`);
}

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await viewport(1440, 900);
  await goHome();
  assert.equal((await state()).active, 'hero');
  assert.equal(await evaluate(`document.querySelectorAll('[data-scene]').length`), 3);
  assert.equal(await evaluate(`document.querySelectorAll('#about-heading').length`), 1);
  assert.equal(await evaluate(`document.querySelectorAll('#connect-heading').length`), 1);
  await screenshot('welcome');
  await wheel(120);
  await pause(400);
  assert.ok((await state()).y > 0 && (await state()).y < 300, 'Wheel stays native, no forced full-page jump');
  await evaluate(`window.scrollTo({top: 450, behavior: 'instant'})`);
  await pause(250);
  const blended = (await state()).layers;
  assert.equal(blended[0], 1, 'Opaque foundation always remains');
  assert.ok(blended[1] > .2 && blended[1] < .8, 'Backgrounds overlap at midpoint');
  await screenshot('crossfade');
  await evaluate(`document.querySelector('#about').scrollIntoView({behavior:'instant'})`);
  await pause(1300);
  assert.equal((await state()).active, 'about');
  await screenshot('about');
  await evaluate(`document.querySelector('.narrative-progress a[href="#connect"]').click()`);
  await pause(1500);
  assert.equal((await state()).active, 'connect');
  await screenshot('connect');
  await evaluate(`document.querySelector('#about').scrollIntoView({behavior:'instant'})`);
  await pause(1400);
  assert.equal((await state()).active, 'about');
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#about h2')).opacity`), '1');
  await goHome();
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
  await pause(1150);
  assert.ok((await state()).y > 100, 'Native PageDown scrolls');
  await evaluate(`document.querySelector('.skip-link').click()`);
  await pause(1000);
  assert.equal(await evaluate(`document.activeElement.id`), 'main');
  console.log('PASS desktop: native wheel, crossfade, reverse reveal, chapter anchors, keyboard, skip focus');

  for (const width of [375, 390, 768, 1024, 1440, 1920]) {
    await viewport(width, width < 800 ? 844 : 900, width < 600);
    await goHome();
    assert.equal((await state()).overflow, false, `Home overflow at ${width}`);
    assert.equal(await evaluate(`document.querySelectorAll('img').length > 0 && [...document.querySelectorAll('.atmosphere img')].every(e => e.complete && e.naturalWidth > 0)`), true, 'All scene images load');
    const badLinks = await evaluate(`[...document.querySelectorAll('a')].map(a=>a.getAttribute('href')).filter(h=>/YOUR_|example.com|\\/(gallery|notes|logs|publications)(?:$|[\\/#])/.test(h))`);
    assert.deepEqual(badLinks, [], 'No retired routes or fabricated contact links');
    if (width === 390) {
      await screenshot('mobile');
      await evaluate(`document.querySelector('#about').scrollIntoView({behavior:'instant'})`);
      await pause(1400);
      await screenshot('mobile-about');
      await evaluate(`document.querySelector('#connect').scrollIntoView({behavior:'instant'})`);
      await pause(1400);
      await screenshot('mobile-connect');
    }
    await send('Page.navigate', { url: `${base}/cv` });
    await pause(900);
    assert.equal((await state()).overflow, false, `CV overflow at ${width}`);
    assert.equal(await evaluate(`document.querySelectorAll('.cv-section').length`), 5);
    if ([390, 1440].includes(width)) await screenshot(`cv-${width}`);
  }
  console.log('PASS Home + CV responsive at 375, 390, 768, 1024, 1440, 1920; images and links');

  for (const route of ['gallery', 'notes', 'logs', 'publications']) {
    assert.equal((await fetch(`${base}/${route}`)).status, 404, `Retired ${route} route is not served`);
  }
  await viewport(390, 844, true);
  await goHome();
  await evaluate(`document.querySelector('.mobile-nav summary').click()`);
  assert.equal(await evaluate(`document.querySelector('.mobile-nav').open`), true);
  await evaluate(`document.querySelector('.mobile-nav a[href="#connect"]').click()`);
  await pause(1500);
  assert.equal(await evaluate(`document.querySelector('.mobile-nav').open`), false);
  assert.equal((await state()).active, 'connect');
  console.log('PASS retired routes return 404; mobile menu and section navigation');

  await viewport(1440, 900);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await goHome();
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.rain')).display`), 'none');
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.narrative-copy')).filter`), 'none');
  assert.equal(await evaluate(`getComputedStyle(document.documentElement).scrollBehavior`), 'auto');
  await send('Emulation.setEmulatedMedia', { features: [] });
  await viewport(1024, 600);
  await goHome();
  assert.equal((await state()).overflow, false);
  await viewport(1440, 900);
  await goHome();
  await evaluate(`document.querySelector('.about-copy').textContent = 'Long introduction. '.repeat(600); window.dispatchEvent(new Event('resize'));`);
  assert.ok(await evaluate(`document.querySelector('#about').offsetHeight > innerHeight`), 'Long copy grows naturally');
  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await goHome();
  assert.equal(await evaluate(`[...document.querySelectorAll('.narrative-copy')].every(e=>getComputedStyle(e).opacity === '1')`), true);
  console.log('PASS reduced motion, short viewport, long content, JavaScript disabled');
  assert.deepEqual(errors, [], 'No browser JavaScript errors');
  console.log('PASS no browser runtime errors');
} finally {
  await send('Emulation.setScriptExecutionDisabled', { value: false });
  socket.close();
}
