// Run after editing homepage store links; the campaign source lives in /app.
import { readFile, writeFile } from 'node:fs/promises';
import { appleBase, playBase, storeLinks } from '../app/store-links.js';

const root = new URL('../', import.meta.url);
const escape = value => value.replaceAll('&', '&amp;');
for (const language of ['sl', 'en', 'es', 'nl', 'th', 'de']) {
  const file = new URL(`${language}/index.html`, root);
  const before = await readFile(file, 'utf8');
  const links = ['es', 'en'].includes(language)
    ? storeLinks(`web-${language}`, 'website') : { apple: appleBase, play: playBase };
  const after = before.replace(/(<a\b[^>]*\bhref=")https:\/\/(apps\.apple\.com|play\.google\.com)\/[^\"]+("[^>]*>)/g,
    (_, start, host, end) => start + escape(host === 'apps.apple.com' ? links.apple : links.play) + end);
  if (before !== after) await writeFile(file, after);
}
// Keep the no-JavaScript fallback aligned with the same default campaign.
const file = new URL('app/index.html', root);
const before = await readFile(file, 'utf8');
const fallback = storeLinks(null);
const after = before.replace(/(<a id="(apple|play)" href=")[^"]+/g, (_, start, id) => start + escape(fallback[id]));
if (before !== after) await writeFile(file, after);
console.log('Store links updated in six homepages and /app fallback.');
