// Anonymous daily counts of visits to the /app download page (WEB-012).
// Contract: billero.app/docs/strategy/measurement.md §9; table: billero.app/cloudflare/billero-stats/migrations/0002_web.sql.
//
// Counted on the server only: a GET of /app/ that the visitor's own navigation sent. The page runs no
// counting script and the browser is never asked to send anything extra (no beacon, pixel, cookie or
// storage), because analytics that access the device need prior consent (ZEKom-2 Art. 225, Information
// Commissioner guidelines on cookies 2023; EDPB Guidelines 2/2023 para. 33).
// Stored: one row per day and allowed property values with a counter. Never stored, logged or forwarded:
// IP, the User-Agent string, cookies, other headers, request.cf, the raw query, or any single visit.
// The page never waits for counting; without the STATS binding (D1 billero-stats) or on a database error
// nothing is counted and the response is unchanged.
import { campaigns } from '../app/store-links.js';

export const APP_PATH = '/app/';
// Same languages and fallback as app/download.js (a test keeps both lists equal).
export const languages = Object.freeze(['es', 'en', 'sl', 'de', 'nl', 'th']);

export const UPSERT_SQL =
  'INSERT INTO web_counts (day, kind, campaign, lang, device, inapp, count) ' +
  'VALUES (?, ?, ?, ?, ?, ?, 1) ' +
  'ON CONFLICT (day, kind, campaign, lang, device, inapp) DO UPDATE SET count = count + 1';

// Link previews, crawlers, monitors and scripts. "Cubot" is an Android phone brand, not a bot.
const BOT = /(?<!cu)bot\b|crawl|spider|slurp|facebookexternalhit|facebookcatalog|meta-external|whatsapp|skypeuripreview|embedly|google-inspectiontool|mediapartners|bingpreview|headlesschrome|lighthouse|pagespeed|python|curl\/|wget|go-http-client|node-fetch|undici|axios|okhttp|java\/|libwww|httpclient|scrapy|phantomjs/i;

export function deviceClass(userAgent) {
  const ua = userAgent || '';
  if (!ua.trim() || BOT.test(ua)) return 'bot';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

export function inAppBrowser(userAgent) {
  const ua = userAgent || '';
  if (/Instagram/i.test(ua)) return 'instagram';
  if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A/.test(ua)) return 'facebook';
  if (/BytedanceWebview|musical_ly|TikTok|trill_/i.test(ua)) return 'tiktok';
  return '';
}

/** Allowlisted code, 'web' without a code, 'unknown' for anything else (the raw value is never stored). */
export function campaignCode(value) {
  if (value === null || value === undefined || value === '') return 'web';
  return Object.prototype.hasOwnProperty.call(campaigns, value) ? value : 'unknown';
}

export function pageLanguage(value) {
  const code = String(value || '').toLowerCase().split(/[-_]/)[0];
  return languages.includes(code) ? code : 'es';
}

export const utcDay = (nowMs = Date.now()) => new Date(nowMs).toISOString().slice(0, 10);

function isPrefetch(headers) {
  const purpose = `${headers.get('Sec-Purpose') || ''} ${headers.get('Purpose') || ''} ${headers.get('X-Purpose') || ''} ${headers.get('X-Moz') || ''}`;
  return /prefetch|prerender|preview/i.test(purpose);
}

function record(runtime, values) {
  const db = runtime?.env?.STATS;
  if (!db || typeof db.prepare !== 'function') return;
  let task;
  try {
    task = Promise.resolve(db.prepare(UPSERT_SQL).bind(...values).run()).catch(() => {});
  } catch {
    return;
  }
  try { runtime.ctx?.waitUntil?.(task); } catch { /* The write still runs; the response never waits. */ }
}

/** Counts one open of /app/. Language switches inside the page (same-origin) and prefetches are not visits. */
export function countVisit(request, url, runtime, nowMs = Date.now()) {
  try {
    if (request.method !== 'GET' || url.pathname !== APP_PATH) return;
    if (request.headers.get('Sec-Fetch-Site') === 'same-origin' || isPrefetch(request.headers)) return;
    const ua = request.headers.get('User-Agent');
    record(runtime, [utcDay(nowMs), 'visit', campaignCode(url.searchParams.get('c')),
      pageLanguage(url.searchParams.get('l')), deviceClass(ua), inAppBrowser(ua)]);
  } catch { /* Counting never changes the page. */ }
}
