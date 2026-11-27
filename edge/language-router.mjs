// Existing origin stays responsible for content. Only entry/legacy URLs redirect.
// /app/ visits are counted anonymously on the server (app-stats.mjs, WEB-012).
import { homeLanguages, pageLanguages, legacyPaths, pagePaths } from './routes.mjs';
import { countVisit } from './app-stats.mjs';

export function selectLanguage(cookie, acceptLanguage) {
  const saved = (cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith('lang='));
  if (saved) {
    try {
      const code = decodeURIComponent(saved.slice(5)).toLowerCase();
      if (pageLanguages.includes(code)) return homeLanguages.includes(code) ? code : 'en';
    } catch { /* Malformed cookies are ignored. */ }
  }
  const preferences = (acceptLanguage || '').split(',').map((part, index) => {
    const [tag, ...params] = part.trim().toLowerCase().split(';');
    const quality = params.find(value => value.trim().startsWith('q='));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    return { code: tag.split('-')[0], q, index };
  }).filter(({ code, q }) => /^[a-z]{2,8}$/.test(code) && Number.isFinite(q) && q > 0 && q <= 1)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return preferences.find(({ code }) => homeLanguages.includes(code))?.code || 'en';
}

function redirect(request, path, status, languageChoice = false) {
  const target = new URL(request.url);
  target.pathname = path;
  const headers = new Headers({ Location: target.href });
  if (languageChoice) {
    headers.set('Vary', 'Accept-Language, Cookie');
    headers.set('Cache-Control', 'private, no-store');
    headers.set('CDN-Cache-Control', 'no-store');
    headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
  } else {
    headers.set('Cache-Control', 'public, max-age=3600');
  }
  return new Response(null, { status, headers });
}

// runtime: { env, ctx } of the Worker; env.STATS (D1) is optional and only used for /app counting.
export async function handleRequest(request, originFetch = fetch, runtime = {}) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method)) return originFetch(request);
  if (url.pathname === '/') {
    return redirect(request, `/${selectLanguage(request.headers.get('Cookie'), request.headers.get('Accept-Language'))}/`, 302, true);
  }
  const legacy = legacyPaths[url.pathname];
  if (legacy) return redirect(request, legacy, 301);
  // Normalize only existing pages. Language-prefixed content never changes language.
  if (url.pathname.endsWith('/index.html')) {
    const home = url.pathname.slice(0, -10);
    if (pagePaths.includes(home)) return redirect(request, home, 301);
  }
  if (url.pathname.endsWith('.html')) {
    const clean = url.pathname.slice(0, -5);
    if (pagePaths.includes(clean)) return redirect(request, clean, 301);
  }
  if (homeLanguages.some(lang => url.pathname === `/${lang}`)) return redirect(request, `${url.pathname}/`, 301);
  countVisit(request, url, runtime);
  return originFetch(request);
}

export default { fetch: (request, env, ctx) => handleRequest(request, fetch, { env, ctx }) };
