import { campaigns, destination } from './store-links.js';

const copy = {
  es: ['Descarga Billero', 'Elige la tienda de tu dispositivo.', 'Si la tienda no se abre, usa uno de estos botones.', 'Abrir en el App Store', 'Abrir en Google Play', 'Abriendo la tienda…'],
  en: ['Download Billero', 'Choose the store for your device.', 'If the store does not open, use one of these buttons.', 'Open in the App Store', 'Open in Google Play', 'Opening the store…'],
  sl: ['Prenesi Billero', 'Izberi trgovino za svojo napravo.', 'Če se trgovina ne odpre, uporabi enega od gumbov.', 'Odpri v App Store', 'Odpri v Google Play', 'Odpiram trgovino…'],
  de: ['Billero herunterladen', 'Wähle den Store für dein Gerät.', 'Falls sich der Store nicht öffnet, nutze eine dieser Schaltflächen.', 'Im App Store öffnen', 'In Google Play öffnen', 'Store wird geöffnet…'],
  nl: ['Download Billero', 'Kies de winkel voor je apparaat.', 'Opent de winkel niet? Gebruik dan een van deze knoppen.', 'Open in de App Store', 'Open in Google Play', 'De winkel wordt geopend…'],
  th: ['ดาวน์โหลด Billero', 'เลือกร้านแอปสำหรับอุปกรณ์ของคุณ', 'หากร้านแอปไม่เปิด ให้ใช้ปุ่มด้านล่าง', 'เปิดใน App Store', 'เปิดใน Google Play', 'กำลังเปิดร้านแอป…'],
};

const params = new URLSearchParams(location.search);
const requested = (params.get('l') || '').toLowerCase().split(/[-_]/)[0];
const language = Object.prototype.hasOwnProperty.call(copy, requested) ? requested : 'es';
const [title, intro, fallback, appleLabel, playLabel, opening] = copy[language];
document.documentElement.lang = language === 'es' ? 'es-US' : language;
document.title = title;
document.querySelector('h1').textContent = title;
document.querySelector('#intro').textContent = intro;
document.querySelector('#fallback').textContent = fallback;
document.querySelector('meta[name="description"]').content = `${title}. ${intro}`;

const { links, store, url } = destination(location.search, navigator);
for (const [id, label] of [['apple', appleLabel], ['play', playLabel]]) {
  const link = document.getElementById(id);
  link.href = links[id];
  link.setAttribute('aria-label', label);
}
for (const link of document.querySelectorAll('[data-language]')) {
  const query = new URLSearchParams({ l: link.dataset.language });
  if (Object.prototype.hasOwnProperty.call(campaigns, params.get('c'))) query.set('c', params.get('c'));
  link.href = `/app/?${query}`;
  if (link.dataset.language === language) link.setAttribute('aria-current', 'page');
}
document.documentElement.classList.add('js');
if (store) {
  document.querySelector('#intro').textContent = opening;
  // The visible links remain usable when an in-app browser blocks navigation.
  try { location.replace(url); } catch { document.querySelector('#intro').textContent = intro; }
}
