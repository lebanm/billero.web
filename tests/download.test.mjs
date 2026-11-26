import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { campaigns, storeLinks, deviceStore, destination } from '../app/store-links.js';
import { agents } from './fixtures/download-agents.mjs';

const expected = [
  ['tt', 'tt', 'tt-ugc'], ['ig', 'ig', 'ig-ugc'], ['fb', 'fb', 'fb-ugc'],
  ['meta-pleskar', 'meta', 'meta-ads-pleskar'], ['meta-keramicar', 'meta', 'meta-ads-keramicar'],
  ['meta-excel', 'meta', 'meta-ads-excel'], ['meta-monter', 'meta', 'meta-ads-monter'],
  ['web-es', 'web', 'web-es'], ['web-en', 'web', 'web-en'],
  ['unknown', 'web', 'web'], [null, 'web', 'web'],
];
test('campaign allowlist contains exactly the approved codes', () => {
  assert.deepEqual(Object.keys(campaigns).sort(), expected.slice(0, 9).map(([code]) => code).sort());
});
for (const [code, source, campaign] of expected) {
  for (const agent of agents) {
    test(`download ${code ?? '(missing)'} / ${agent.name}`, () => {
      const result = destination(code === null ? '' : `?c=${encodeURIComponent(code)}`, agent);
      const apple = new URL(result.links.apple), play = new URL(result.links.play);
      assert.equal(apple.origin + apple.pathname, 'https://apps.apple.com/app/apple-store/id6760204857');
      assert.deepEqual(Object.fromEntries(apple.searchParams), { pt: '128559527', ct: campaign, mt: '8' });
      assert.equal(play.origin + play.pathname, 'https://play.google.com/store/apps/details');
      assert.deepEqual([...play.searchParams.keys()], ['id', 'referrer']);
      assert.equal(play.searchParams.get('id'), 'com.billero.app');
      // One outer decode must produce a valid nested query, without losing any utm field.
      assert.equal(play.searchParams.get('referrer'), `utm_source=${source}&utm_medium=social&utm_campaign=${campaign}`);
      assert.match(play.search, /referrer=utm_source%3D.*%26utm_medium%3Dsocial%26utm_campaign%3D/);
      assert.equal(result.store, agent.store);
      assert.equal(result.url, agent.store ? result.links[agent.store] : null);
    });
  }
}
test('untrusted campaign values cannot change the host or inject parameters', () => {
  for (const code of ['', '__proto__', 'constructor', 'toString', 'FB', ' fb', 'fb&ct=evil', 'https://evil.example/', '//evil.example', '<script>', '%66b']) {
    assert.deepEqual(storeLinks(code), storeLinks(null));
  }
  assert.deepEqual(destination('?c=fb&ct=evil&url=https://evil.example&referrer=bad', agents[0]).links, storeLinks('fb'));
  assert.deepEqual(destination('?c=unknown&c=fb', agents[0]).links, storeLinks(null));
  assert.deepEqual(destination('?c=%66b', agents[0]).links, storeLinks('fb'));
});
test('UAData fallback, absent hints, and real UA precedence', () => {
  assert.equal(deviceStore(), null);
  assert.equal(deviceStore({ userAgentData: { platform: 'Android' } }), 'play');
  assert.equal(deviceStore({ userAgentData: { platform: 'iOS' } }), 'apple');
  assert.equal(deviceStore({ userAgentData: { platform: 'iPadOS' } }), 'apple');
  assert.equal(deviceStore({ userAgentData: { platform: 'Windows', mobile: true } }), null);
  assert.equal(deviceStore({ ...agents[0], userAgentData: { platform: 'Windows' } }), 'apple');
});
test('static fallbacks and all homepage store buttons have the intended attribution', async () => {
  for (const lang of ['sl', 'en', 'es', 'nl', 'th', 'de', 'app']) {
    const html = await readFile(new URL(`../${lang}/index.html`, import.meta.url), 'utf8');
    const anchors = [...html.matchAll(/<a\b[^>]*href="(https:\/\/(?:apps\.apple\.com|play\.google\.com)\/[^\"]+)"/g)].map(match => new URL(match[1].replaceAll('&amp;', '&')));
    assert.equal(anchors.length, lang === 'app' ? 2 : 4, lang);
    for (const url of anchors) {
      assert.ok(!url.pathname.startsWith('/si/'));
      const tagged = ['en', 'es', 'app'].includes(lang);
      const campaign = lang === 'app' ? 'web' : `web-${lang}`;
      if (url.hostname === 'apps.apple.com') {
        assert.equal(url.searchParams.get('ct'), tagged ? campaign : null);
        assert.equal(url.searchParams.get('pt'), tagged ? '128559527' : null);
      } else {
        assert.equal(url.searchParams.get('referrer'), tagged ? `utm_source=web&utm_medium=${lang === 'app' ? 'social' : 'website'}&utm_campaign=${campaign}` : null);
      }
    }
  }
});
