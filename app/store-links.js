// Campaign allowlist shared by /app, the homepage updater and the tests.
export const campaigns = Object.freeze({
  tt: { source: 'tt', campaign: 'tt-ugc' },
  ig: { source: 'ig', campaign: 'ig-ugc' },
  fb: { source: 'fb', campaign: 'fb-ugc' },
  'meta-pleskar': { source: 'meta', campaign: 'meta-ads-pleskar' },
  'meta-keramicar': { source: 'meta', campaign: 'meta-ads-keramicar' },
  'meta-excel': { source: 'meta', campaign: 'meta-ads-excel' },
  'meta-monter': { source: 'meta', campaign: 'meta-ads-monter' },
  'web-es': { source: 'web', campaign: 'web-es' },
  'web-en': { source: 'web', campaign: 'web-en' },
});

export const appleBase = 'https://apps.apple.com/app/apple-store/id6760204857';
export const playBase = 'https://play.google.com/store/apps/details?id=com.billero.app';

export function storeLinks(code, medium = 'social') {
  const campaign = Object.prototype.hasOwnProperty.call(campaigns, code)
    ? campaigns[code] : { source: 'web', campaign: 'web' };
  const apple = new URL(appleBase);
  apple.search = new URLSearchParams({ pt: '128559527', ct: campaign.campaign, mt: '8' });
  const referrer = new URLSearchParams({
    utm_source: campaign.source,
    utm_medium: medium === 'website' ? 'website' : 'social',
    utm_campaign: campaign.campaign,
  });
  const play = new URL(playBase);
  play.searchParams.set('referrer', referrer.toString());
  return { apple: apple.href, play: play.href };
}

export function deviceStore(navigator = {}) {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'apple';
  if (/Android/i.test(ua)) return 'play';
  // iPadOS may identify itself as a desktop Mac, including in embedded browsers.
  if ((navigator.platform === 'MacIntel' || /Macintosh/i.test(ua))
      && navigator.maxTouchPoints > 1) return 'apple';
  const platform = navigator.userAgentData?.platform?.toLowerCase();
  if (platform === 'android') return 'play';
  if (platform === 'ios' || platform === 'ipados') return 'apple';
  return null;
}

export function destination(search, navigator) {
  const links = storeLinks(new URLSearchParams(search).get('c'));
  const store = deviceStore(navigator);
  return { links, store, url: store ? links[store] : null };
}
