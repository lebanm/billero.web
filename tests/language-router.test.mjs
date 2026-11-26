import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest, selectLanguage } from '../edge/language-router.mjs';
import { pagePaths, legacyPaths } from '../edge/routes.mjs';

const cases = [
  ['German regional preference', '', 'de-DE,de;q=0.9', 'de'],
  ['Mexican Spanish', '', 'es-MX', 'es'],
  ['US Spanish', '', 'es-US, en;q=0.8', 'es'],
  ['Slovenian', '', 'sl', 'sl'],
  ['English region', '', 'en-CA', 'en'],
  ['Dutch region', '', 'nl-BE', 'nl'],
  ['Thai', '', 'th-TH', 'th'],
  ['No preference', '', '', 'en'],
  ['Missing Japanese home', '', 'ja', 'en'],
  ['Missing French home', '', 'fr-FR', 'en'],
  ['Cookie takes precedence', 'lang=sl', 'de', 'sl'],
  ['Policy-only language saved', 'lang=ja', 'de', 'en'],
  ['Other cookies ignored', 'other=es; lang=nl; token=abc', 'sl', 'nl'],
  ['Invalid cookie ignored', 'lang=../../bad', 'de', 'de'],
  ['Malformed cookie ignored', 'lang=%E0%A4%A', 'sl', 'sl'],
  ['Quality weights', '', 'sl;q=0.4,de;q=0.9', 'de'],
  ['Excluded language', '', 'sl;q=0,de;q=0.5', 'de'],
  ['Invalid quality', '', 'sl;q=oops,de;q=0.5', 'de'],
  ['Stable equal preference', '', 'nl;q=0.8,sl;q=0.8', 'nl'],
  ['Wildcard fallback', '', '*', 'en'],
];
for (const [name, cookie, languages, expected] of cases) test(name, () => assert.equal(selectLanguage(cookie, languages), expected));

test('entry is 302, varies by both inputs, never cached, preserves campaign query', async () => {
  const response = await handleRequest(new Request('https://billero.app/?utm_source=test', { headers: { 'Accept-Language': 'es-MX' } }));
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), 'https://billero.app/es/?utm_source=test');
  assert.equal(response.headers.get('Vary'), 'Accept-Language, Cookie');
  assert.match(response.headers.get('Cache-Control'), /no-store/);
  assert.equal(response.headers.get('Cloudflare-CDN-Cache-Control'), 'no-store');
});
test('all old root documents are 301 and preserve query strings', async () => {
  for (const [source,target] of Object.entries(legacyPaths)) {
    const response = await handleRequest(new Request(`https://billero.app${source}?source=app`, { method:'HEAD', headers:{'Accept-Language':'de'} }));
    assert.equal(response.status,301,source);
    assert.equal(response.headers.get('Location'),`https://billero.app${target}?source=app`);
  }
});
test('every canonical localized page passes unchanged regardless of cookie or browser language', async () => {
  for (const path of pagePaths) {
    const request = new Request(`https://billero.app${path}`, { headers:{Cookie:'lang=sl','Accept-Language':'es'} });
    const response = await handleRequest(request, passed => { assert.equal(passed,request); return new Response('origin'); });
    assert.equal(response.status,200,path);
    assert.equal(await response.text(),'origin');
  }
});
test('static resources, unknown URLs and non-GET requests pass through', async () => {
  for (const path of ['/img/a.webp','/unknown','/fr/','//elsewhere.example']) {
    const response=await handleRequest(new Request(`https://billero.app${path}`),()=>new Response('origin',{status:404}));
    assert.equal(response.status,404,path);
  }
  const response=await handleRequest(new Request('https://billero.app/',{method:'POST'}),()=>new Response(null,{status:204}));
  assert.equal(response.status,204);
});
test('HTML aliases normalize within the requested language', async () => {
  for (const [source,target] of [['/index.html','/sl/'],['/index','/sl/'],['/de/privacy-policy.html','/de/privacy-policy'],['/sl/index.html','/sl/'],['/es','/es/']]) {
    const response=await handleRequest(new Request(`https://billero.app${source}`,{headers:{'Accept-Language':'th'}}));
    assert.equal(response.status,301);
    assert.equal(response.headers.get('Location'),`https://billero.app${target}`);
  }
});
