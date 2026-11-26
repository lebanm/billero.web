// Usage: node scripts/check-download.mjs [base URL] [evidence directory]
// Run against scripts/preview.mjs --static to verify independence from the Worker.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { agents } from '../tests/fixtures/download-agents.mjs';

const base = process.argv[2] || 'http://127.0.0.1:8789';
const output = path.resolve(process.argv[3] || '../billero.app/docs/strategy/evidence/WEB-010');
await mkdir(output, { recursive: true });
const result = { base, checkedUTC: new Date().toISOString(), aliases: [], redirects: [], layouts: [], fallbacks: [], errors: [] };
const aliases = ['/app', '/app/', '/app/index.html'];
const storePattern = /^https:\/\/(apps\.apple\.com|play\.google\.com)\//;
const browser = await chromium.launch({ headless: true });
try {
  for (const alias of aliases) {
    const response = await fetch(`${base}${alias}?c=fb&l=en`, { redirect: 'manual' });
    assert.equal(response.status, alias === '/app' ? 301 : 200);
    if (response.status === 301) assert.equal(response.headers.get('location'), `${base}/app/?c=fb&l=en`);
    result.aliases.push({ alias, status: response.status, location: response.headers.get('location') });
  }
  for (const agent of agents.filter(agent => agent.store)) {
    for (const alias of aliases) {
      const context = await browser.newContext({ userAgent: agent.userAgent, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
      await context.addInitScript(({ platform, maxTouchPoints }) => {
        if (platform) Object.defineProperty(navigator, 'platform', { get: () => platform });
        if (maxTouchPoints) Object.defineProperty(navigator, 'maxTouchPoints', { get: () => maxTouchPoints });
      }, agent);
      await context.route(`${base}/before-download`, route => route.fulfill({ contentType: 'text/html', body: '<title>Before download</title>' }));
      await context.route(storePattern, route => route.fulfill({ contentType: 'text/html', body: '<title>Intercepted store destination</title>' }));
      const page = await context.newPage();
      page.on('pageerror', error => result.errors.push(`${agent.name}: ${error.message}`));
      await page.goto(`${base}/before-download`);
      await page.goto(`${base}${alias}?c=meta-excel&l=es`, { waitUntil: 'commit' });
      await page.waitForURL(storePattern);
      const url = new URL(page.url());
      if (agent.store === 'apple') {
        assert.equal(url.hostname, 'apps.apple.com');
        assert.equal(url.pathname, '/app/apple-store/id6760204857');
        assert.equal(url.searchParams.get('pt'), '128559527');
        assert.equal(url.searchParams.get('ct'), 'meta-ads-excel');
      } else {
        assert.equal(url.hostname, 'play.google.com');
        assert.equal(url.searchParams.get('id'), 'com.billero.app');
        assert.equal(url.searchParams.get('referrer'), 'utm_source=meta&utm_medium=social&utm_campaign=meta-ads-excel');
      }
      await page.goBack();
      assert.equal(page.url(), `${base}/before-download`, 'replace must not leave /app in browser history');
      result.redirects.push({ agent: agent.name, alias, target: url.href, back: 'before-download' });
      await context.close();
    }
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  page.on('pageerror', error => result.errors.push(error.message));
  for (const language of ['es', 'en', 'sl', 'de', 'nl', 'th']) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}/app/?c=fb&l=${language}`);
      await page.locator('html.js').waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'), language === 'es' ? 'es-US' : language);
      assert.equal(await page.locator('nav [aria-current="page"]').count(), 1);
      for (const id of ['apple', 'play']) assert.ok(await page.locator(`#${id}`).isVisible());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator('img').evaluate(image => image.complete && image.naturalWidth > 0), true);
      for (const id of ['apple', 'play']) {
        const box = await page.locator(`#${id}`).boundingBox();
        assert.ok(box.height >= 44 && box.width >= 44);
      }
      result.layouts.push({ language, width, overflow: false, storeButtons: 2 });
      if (language === 'es' && [390, 1440].includes(width)) {
        await page.screenshot({ path: path.join(output, `04-desktop-es-${width}.png`) });
      }
    }
  }
  await page.goto(`${base}/app/?c=fb&l=es`);
  await page.locator('html.js').waitFor();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'apple');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'play');
  await page.locator('nav [data-language="en"]').click();
  await page.locator('html.js').waitFor();
  assert.equal(new URL(page.url()).searchParams.get('c'), 'fb');
  assert.equal(await page.locator('h1').textContent(), 'Download Billero');
  for (const query of ['', '?l=unknown&c=constructor', '?l=en-US&c=https://evil.example/']) {
    await page.goto(`${base}/app/${query}`);
    await page.locator('html.js').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), query.includes('en-US') ? 'en' : 'es-US');
    assert.equal(new URL(await page.locator('#apple').getAttribute('href')).searchParams.get('ct'), 'web');
  }
  assert.deepEqual(await context.cookies(), []);
  assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
  assert.ok(requests.every(url => url.startsWith(`${base}/app/`)), 'standalone page must not load external or shared assets');
  await context.close();
  for (const alias of aliases) {
    const context = await browser.newContext({ javaScriptEnabled: false, userAgent: agents[0].userAgent, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${base}${alias}?c=fb&l=en`);
    assert.ok(await page.locator('noscript').isVisible());
    assert.equal(await page.locator('nav').isVisible(), false);
    for (const id of ['apple', 'play']) {
      assert.ok(await page.locator(`#${id}`).isVisible());
      const url = new URL(await page.locator(`#${id}`).getAttribute('href'));
      assert.equal(id === 'apple' ? url.searchParams.get('ct') : new URLSearchParams(url.searchParams.get('referrer')).get('utm_campaign'), 'web');
    }
    result.fallbacks.push({ alias, noJavaScript: true, language: 'es-US', campaign: 'web', storeButtons: 2 });
    await context.close();
  }
  // A 204 response leaves the page visible, modeling a handoff that does not navigate.
  const blocked = await browser.newContext({ userAgent: agents[0].userAgent, viewport: { width: 390, height: 844 } });
  const attempts = [];
  await blocked.route(storePattern, route => { attempts.push(route.request().url()); return route.fulfill({ status: 204 }); });
  const fallback = await blocked.newPage();
  await fallback.goto(`${base}/app/?c=ig&l=en`, { waitUntil: 'networkidle' });
  assert.equal(attempts.length, 1);
  assert.ok(await fallback.locator('#apple').isVisible());
  assert.ok(await fallback.locator('#play').isVisible());
  assert.ok(await fallback.locator('#fallback').isVisible());
  const nextRequest = fallback.waitForRequest(storePattern);
  await fallback.locator('#play').click({ noWaitAfter: true });
  const manual = new URL((await nextRequest).url());
  assert.equal(manual.hostname, 'play.google.com');
  assert.equal(new URLSearchParams(manual.searchParams.get('referrer')).get('utm_campaign'), 'ig-ugc');
  result.fallbacks.push({ blockedHandoff: true, manualOtherStore: manual.href });
  await blocked.close();
  assert.deepEqual(result.errors, []);
} finally {
  await browser.close();
  await writeFile(path.join(output, '04-browser-checks.json'), JSON.stringify(result, null, 2));
}
console.log(JSON.stringify({ redirects: result.redirects.length, layouts: result.layouts.length, fallbacks: result.fallbacks.length, errors: result.errors }, null, 2));
