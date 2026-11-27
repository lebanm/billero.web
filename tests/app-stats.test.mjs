// WEB-012: anonymous server-side counting of /app visits (edge/app-stats.mjs, billero.app/docs/strategy/measurement.md §9).
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { handleRequest } from '../edge/language-router.mjs';
import siteWorker from '../edge/site-worker.mjs';
import { APP_PATH, UPSERT_SQL, languages, campaignCode, deviceClass, inAppBrowser, pageLanguage, utcDay } from '../edge/app-stats.mjs';
import { campaigns } from '../app/store-links.js';
import { agents } from './fixtures/download-agents.mjs';

const iphone = agents.find(agent => agent.name === 'iPhone Safari').userAgent;
const facebookIphone = agents.find(agent => agent.name === 'Facebook iPhone').userAgent;
const today = utcDay();

// D1 stand-in: records every prepared statement; can be told to fail.
function fakeStats({ failPrepare = false, failRun = false } = {}) {
  const calls = [];
  const waits = [];
  const env = {
    STATS: {
      prepare(sql) {
        if (failPrepare) throw new Error('prepare failed');
        return { bind: (...values) => ({ run: async () => { calls.push({ sql, values }); if (failRun) throw new Error('run failed'); return { meta: { changes: 1 } }; } }) };
      },
    },
  };
  const ctx = { waitUntil: promise => waits.push(promise) };
  return { runtime: { env, ctx }, calls, settle: () => Promise.all(waits) };
}

const origin = () => {
  const seen = [];
  const fetcher = async request => { seen.push(request); return new Response('page', { status: 200, headers: { 'X-Origin': '1' } }); };
  return { seen, fetcher };
};

const get = (path, headers = {}, method = 'GET') => new Request(`https://billero.app${path}`, { method, headers: { 'User-Agent': iphone, ...headers } });

test('visit: GET /app/ counts one row of allowed values and returns the origin response unchanged', async () => {
  const stats = fakeStats();
  const { seen, fetcher } = origin();
  const response = await handleRequest(get('/app/?c=meta-vodovodar&l=en&utm_source=x', { 'User-Agent': facebookIphone, Cookie: 'lang=sl', 'X-Forwarded-For': '203.0.113.7' }), fetcher, stats.runtime);
  await stats.settle();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Origin'), '1');
  assert.equal(response.headers.get('Set-Cookie'), null);
  assert.equal(await response.text(), 'page');
  assert.equal(seen.length, 1);
  assert.deepEqual(stats.calls, [{ sql: UPSERT_SQL, values: [today, 'visit', 'meta-vodovodar', 'en', 'ios', 'facebook'] }]);
});

test('visit: values never contain the raw query, IP, cookie or User-Agent', async () => {
  const stats = fakeStats();
  await handleRequest(get('/app/?c=<script>&l=xx-YY&email=a@b.c', { Cookie: 'id=secret', 'CF-Connecting-IP': '198.51.100.9' }), origin().fetcher, stats.runtime);
  await stats.settle();
  assert.deepEqual(stats.calls[0].values, [today, 'visit', 'unknown', 'es', 'ios', '']);
  const stored = JSON.stringify(stats.calls);
  for (const secret of ['<script>', 'a@b.c', 'secret', '198.51.100.9', 'Mozilla', 'xx']) assert.equal(stored.includes(secret), false, secret);
  assert.equal(/\$\{/.test(UPSERT_SQL), false);
  assert.equal((UPSERT_SQL.match(/\?/g) || []).length, 6);
});

test('visit: only GET of exactly /app/ from outside the page counts', async () => {
  const cases = [
    get('/app/', {}, 'HEAD'),
    get('/app/', {}, 'POST'),
    get('/app/e?k=auto&s=play', {}, 'POST'),
    get('/app'),
    get('/app/index.html'),
    get('/app/download.js'),
    get('/en/'),
    get('/app/?l=de', { 'Sec-Fetch-Site': 'same-origin' }),
    get('/app/', { 'Sec-Purpose': 'prefetch;prerender' }),
    get('/app/', { Purpose: 'prefetch' }),
  ];
  for (const request of cases) {
    const stats = fakeStats();
    await handleRequest(request, origin().fetcher, stats.runtime);
    await stats.settle();
    assert.equal(stats.calls.length, 0, `${request.method} ${request.url} ${[...request.headers].join()}`);
  }
  for (const site of ['cross-site', 'none', null]) {
    const stats = fakeStats();
    await handleRequest(get('/app/', site ? { 'Sec-Fetch-Site': site } : {}), origin().fetcher, stats.runtime);
    await stats.settle();
    assert.equal(stats.calls.length, 1, String(site));
  }
});

test('without STATS, with a failing database or without ctx the page is served the same', async () => {
  for (const runtime of [undefined, {}, { env: {} }, fakeStats({ failPrepare: true }).runtime, fakeStats({ failRun: true }).runtime, { env: fakeStats().runtime.env }]) {
    const { seen, fetcher } = origin();
    const response = await handleRequest(get('/app/?c=fb'), fetcher, runtime);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'page');
    assert.equal(seen.length, 1);
  }
  const failing = fakeStats({ failRun: true });
  await handleRequest(get('/app/'), origin().fetcher, failing.runtime);
  await assert.doesNotReject(failing.settle());
});

test('the download page itself sends nothing for statistics (no beacon, fetch, pixel, cookie or storage)', () => {
  for (const file of ['../app/download.js', '../app/store-links.js', '../app/index.html']) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    for (const pattern of [/sendBeacon/, /\bfetch\(/, /XMLHttpRequest/, /new Image\b/, /document\.cookie/, /localStorage/, /sessionStorage/, /indexedDB/, /\/app\/e\b/]) {
      assert.equal(pattern.test(source), false, `${file}: ${pattern}`);
    }
  }
});

test('device, in-app browser and bot classes', () => {
  const expected = {
    'iPhone Safari': ['ios', ''], 'iPad Safari': ['ios', ''], 'iPad desktop mode': ['other', ''],
    'Android Chrome': ['android', ''], 'Facebook iPhone': ['ios', 'facebook'], 'Instagram iPhone': ['ios', 'instagram'],
    'TikTok iPhone': ['ios', 'tiktok'], 'Facebook Android': ['android', 'facebook'], 'Instagram Android': ['android', 'instagram'],
    'TikTok Android': ['android', 'tiktok'], 'Windows desktop': ['other', ''], 'Mac desktop': ['other', ''], 'Windows touch laptop': ['other', ''],
  };
  for (const agent of agents) assert.deepEqual([deviceClass(agent.userAgent), inAppBrowser(agent.userAgent)], expected[agent.name], agent.name);
  for (const ua of ['', '  ', null, 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'meta-externalagent/1.1',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'Mozilla/5.0 (compatible; bingbot/2.0)', 'Twitterbot/1.0',
    'WhatsApp/2.23.20.0', 'Slackbot-LinkExpanding 1.0', 'TelegramBot (like TwitterBot)', 'curl/8.4.0', 'python-requests/2.31',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/130.0.0.0 Safari/537.36', 'AdsBot-Google (+http://www.google.com/adsbot.html)']) {
    assert.equal(deviceClass(ua), 'bot', String(ua));
  }
  assert.equal(deviceClass('Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36'), 'android');
});

test('campaign and language values follow store-links.js and download.js', () => {
  for (const code of Object.keys(campaigns)) assert.equal(campaignCode(code), code);
  for (const value of [null, undefined, '']) assert.equal(campaignCode(value), 'web');
  for (const value of ['__proto__', 'constructor', 'toString', 'FB', ' fb', 'web', 'unknown', 'fb&ct=evil', 'https://evil.example/']) assert.equal(campaignCode(value), 'unknown', value);
  const source = readFileSync(new URL('../app/download.js', import.meta.url), 'utf8');
  const copyLanguages = [...source.matchAll(/^\s{2}([a-z]{2}): \[/gm)].map(match => match[1]);
  assert.deepEqual(copyLanguages, [...languages]);
  assert.match(source, /: 'es';\r?\n/);
  for (const [value, code] of [['en', 'en'], ['EN-us', 'en'], ['de_AT', 'de'], ['th', 'th'], ['ja', 'es'], ['', 'es'], [null, 'es']]) assert.equal(pageLanguage(value), code);
  assert.equal(APP_PATH, '/app/');
});

test('site Worker entry passes env and ctx and serves assets through env.ASSETS', async () => {
  const stats = fakeStats();
  const assets = [];
  const env = { ...stats.runtime.env, ASSETS: { fetch: async request => { assets.push(new URL(request.url).pathname); return new Response('asset'); } } };
  const response = await siteWorker.fetch(get('/app/?c=ig&l=nl'), env, stats.runtime.ctx);
  await stats.settle();
  assert.equal(await response.text(), 'asset');
  assert.deepEqual(assets, ['/app/']);
  assert.deepEqual(stats.calls[0].values, [today, 'visit', 'ig', 'nl', 'ios', '']);
  const redirect = await siteWorker.fetch(get('/index.html'), env, stats.runtime.ctx);
  assert.equal(redirect.status, 301);
  const noStats = await siteWorker.fetch(get('/app/'), { ASSETS: env.ASSETS }, { waitUntil() {} });
  assert.equal(await noStats.text(), 'asset');
});

// Real SQLite with the shared D1 migration (billero.app next to billero.web, as on Matej's machine).
const migration = new URL('../../billero.app/cloudflare/billero-stats/migrations/0002_web.sql', import.meta.url);
test('UPSERT_SQL matches the web_counts migration of the billero-stats database', { skip: !existsSync(migration) && 'billero.app is not next to billero.web' }, async () => {
  const { DatabaseSync } = await import('node:sqlite');
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(migration, 'utf8'));
  const db = { prepare: sql => ({ bind: (...values) => ({ run: async () => sqlite.prepare(sql).run(...values) }) }) };
  const waits = [];
  const runtime = { env: { STATS: db }, ctx: { waitUntil: promise => waits.push(promise) } };
  await handleRequest(get('/app/?c=tt&l=en'), origin().fetcher, runtime);
  await handleRequest(get('/app/?c=tt&l=en'), origin().fetcher, runtime);
  await handleRequest(get('/app/?c=tt&l=en', { 'User-Agent': 'facebookexternalhit/1.1' }), origin().fetcher, runtime);
  await Promise.all(waits);
  const rows = sqlite.prepare('SELECT * FROM web_counts ORDER BY device').all().map(row => ({ ...row }));
  assert.deepEqual(rows, [
    { day: today, kind: 'visit', campaign: 'tt', lang: 'en', device: 'bot', inapp: '', count: 1 },
    { day: today, kind: 'visit', campaign: 'tt', lang: 'en', device: 'ios', inapp: '', count: 2 },
  ]);
});
