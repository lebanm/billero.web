"""Refresh canonical URLs, language navigation, edge inventory and sitemap.

Does not generate/translate page content. Run after adding a localized HTML page.
The root HTML documents are retained as compatibility sources; the edge returns 301.
"""
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
import json
import re
import html

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://billero.app'
LANGUAGES = dict(sl='Slovenščina', en='English', de='Deutsch', es='Español', nl='Nederlands', th='ไทย', cs='Čeština', hr='Hrvatski', ja='日本語', pl='Polski', pt='Português', sk='Slovenčina')
LABELS = dict(sl='Izberi jezik', en='Choose language', de='Sprache wählen', es='Elegir idioma', nl='Kies taal', th='เลือกภาษา', cs='Vybrat jazyk', hr='Odaberi jezik', ja='言語を選択', pl='Wybierz język', pt='Escolher idioma', sk='Vybrať jazyk')

def inventory():
    guides = json.loads((ROOT/'scripts/invoice-guides.json').read_text(encoding='utf-8'))['pages']
    guide_families = {p['file']: 'invoice-requirements-'+p['country'] for p in guides}
    pages = {}
    for lang in LANGUAGES:
        for p in sorted((ROOT/lang).rglob('*.html')):
            filename = p.relative_to(ROOT).as_posix()
            relative = p.relative_to(ROOT/lang).with_suffix('').as_posix()
            pages[filename] = {'lang':lang, 'family':guide_families.get(filename, relative),
                               'url':f'/{lang}/' + ('' if relative == 'index' else relative)}
    missing = set(guide_families)-set(pages)
    if missing: raise ValueError(f'Build invoice guides first: {sorted(missing)}')
    return pages

def missing_page_redirects(pages):
    """Fallback only for known languages and absent home/contact/donate pages."""
    paths = {page['url'] for page in pages.values()}
    redirects = {}
    for lang in LANGUAGES:
        if f'/{lang}/' not in paths:
            for suffix in ('', '/', '/index', '/index.html'):
                redirects[f'/{lang}{suffix}'] = '/'
        for family in ('contact', 'donate'):
            target = f'/en/{family}'
            if target not in paths:
                raise ValueError(f'Missing fallback target: {target}')
            source = f'/{lang}/{family}'
            if source not in paths:
                redirects[source] = redirects[source+'.html'] = target
    return redirects

def main():
    pages = inventory()
    families = {}
    aliases = {}
    for filename, page in pages.items():
        families.setdefault(page['family'], {})[page['lang']] = page['url']
        aliases['/'+filename] = page['url']
        if page['lang'] == 'sl':
            if page['family'] != 'index' and (ROOT/Path(filename).name).is_file():
                aliases['/'+Path(filename).name] = page['url']
                aliases['/'+page['family']] = page['url']
        elif page['family'] == 'release-notes':
            aliases[f'/release-notes-{page["lang"]}.html'] = page['url']
            aliases[f'/release-notes-{page["lang"]}'] = page['url']
    aliases['/index.html'] = aliases['/index'] = '/sl/' # links to old SL home, not automatic entry
    legacy = {key:value for key,value in aliases.items() if key.count('/') == 1}
    legacy.update(missing_page_redirects(pages))
    docs = dict(pages)
    for p in ROOT.glob('*.html'):
        if '/'+p.name in aliases and p.name != 'index.html':
            target = aliases['/'+p.name]
            docs[p.name] = next(page for page in pages.values() if page['url'] == target)
    for filename, page in docs.items():
        p = ROOT/filename
        text = p.read_text(encoding='utf-8')
        # Migrated sources are converted once before this script, so paths are now absolute.
        def link(match):
            attr, quote, value = match.groups()
            if value.startswith(('#','mailto:','tel:','data:','javascript:')): return match[0]
            url = urlsplit(urljoin(ORIGIN+'/'+filename, html.unescape(value)))
            if url.netloc != 'billero.app': return match[0]
            path = aliases.get(url.path, url.path)
            if path.endswith('/index.html') and path[1:] not in pages: path = '/en/'
            updated = urlunsplit(('', '', path, url.query, url.fragment))
            return attr+'='+quote+html.escape(updated, quote=True)+quote
        text = re.sub(r'\b(href|src)=([\"\'])(.*?)\2', link, text)
        text = re.sub(r'\s*<link\b[^>]*rel=[\"\'](?:canonical|alternate)[\"\'][^>]*>', '', text)
        family = families[page['family']]
        default = '/' if page['family'] == 'index' else family.get('en', next(iter(family.values())))
        alternatives = dict(family, **{'x-default':default})
        metadata = '\n    <link rel="canonical" href="'+ORIGIN+page['url']+'">\n'
        metadata += '\n'.join(f'    <link rel="alternate" hreflang="{lang}" href="{ORIGIN}{url}">' for lang,url in alternatives.items())+'\n'
        text = re.sub(r'\s*</head>', lambda m:metadata+'  </head>', text, count=1)
        if page['lang'] in families['index'] and page['lang'] != 'en':
            text = re.sub(r'<header\b.*?</header>',lambda m:m[0].replace('href="/en/"',f'href="/{page["lang"]}/"'),text,flags=re.S)
        def choices(menu=False):
            return '\n'.join(f'<a href="{url}" lang="{lang}" hreflang="{lang}" data-lang="{lang}"'+(' aria-current="page"' if lang == page['lang'] else '')+'>'+ (LANGUAGES[lang] if menu else lang.upper())+'</a>' for lang,url in family.items())
        if 'class="language-menu"' in text:
            text = re.sub(r'(<div class="language-menu">).*?</div>', lambda m:m[1]+'\n'+choices(True)+'\n</div>', text, flags=re.S)
        elif re.search(r'<(?:div|nav) class="(?:lang-links|locale-nav)"',text):
            text = re.sub(r'<(div|nav) class="(?:lang-links|locale-nav)"[^>]*>.*?</\1>', lambda m:f'<nav class="locale-nav" aria-label="{LABELS[page["lang"]]}">\n'+choices()+'\n</nav>',text,flags=re.S)
        else:
            text = re.sub(r'(<body[^>]*>)', lambda m:m[1]+f'\n<nav class="locale-nav" aria-label="{LABELS[page["lang"]]}">\n'+choices()+'\n</nav>',text,count=1)
        if '/js/language.js' not in text: text = text.replace('</head>', '    <script src="/js/language.js" defer></script>\n  </head>')
        if '/css/language.css' not in text: text = text.replace('</head>', '    <link rel="stylesheet" href="/css/language.css">\n  </head>')
        # Keep Open Graph and structured page identifiers aligned with the new canonical.
        text = re.sub(r'(<meta property="og:url" content=")[^"]+', lambda m:m[1]+ORIGIN+page['url'],text)
        if page['lang']=='sl' and page['family']=='index': text=text.replace('"https://billero.app/#faq"','"https://billero.app/sl/#faq"')
        text = re.sub(r'[ \t]+$', '', text, flags=re.M)
        if text != p.read_text(encoding='utf-8'): p.write_text(text,encoding='utf-8')
    home = list(families['index'])
    # The entry document is intentionally neutral, never a flash of Slovenian content.
    entry = '''<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Billero – Choose your language</title>
<meta name="description" content="Choose your language for Billero, the mobile invoicing app for sole proprietors and one-person businesses.">
<link rel="canonical" href="https://billero.app/">
'''
    entry += '\n'.join(f'<link rel="alternate" hreflang="{lang}" href="{ORIGIN}{url}">' for lang,url in dict(families['index'],**{'x-default':'/'}).items())
    entry += '\n<script src="/js/language-entry.js"></script>\n<script src="/js/language.js" defer></script>\n<link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/language.css">\n</head><body><main class="container"><h1>Billero</h1><p>Choose your language</p><nav class="locale-nav" aria-label="Choose language">'
    entry += '\n'.join(f'<a href="/{lang}/" lang="{lang}" hreflang="{lang}" data-lang="{lang}">{LANGUAGES[lang]}</a>' for lang in home)
    entry += '</nav></main></body></html>\n'
    (ROOT/'index.html').write_text(entry,encoding='utf-8')
    (ROOT/'js/language-entry.js').write_text('''// Static-host fallback; the edge provides the real HTTP 302.
(function () {
  'use strict';
  var available = AVAILABLE;
  var known = KNOWN;
  var chosen;
  try {
    var saved = document.cookie.split(';').map(function (v) { return v.trim(); }).find(function (v) { return v.indexOf('lang=') === 0; });
    if (saved) {
      var code = decodeURIComponent(saved.slice(5)).toLowerCase();
      if (known.indexOf(code) !== -1) chosen = available.indexOf(code) !== -1 ? code : 'en';
    }
  } catch (_) {}
  if (!chosen) {
    var preferences = navigator.languages || [navigator.language || 'en'];
    chosen = preferences.map(function (v) { return v.toLowerCase().split('-')[0]; }).find(function (v) { return available.indexOf(v) !== -1; }) || 'en';
  }
  location.replace('/' + chosen + '/' + location.search + location.hash);
})();
'''.replace('AVAILABLE',json.dumps(home)).replace('KNOWN',json.dumps(list(LANGUAGES))),encoding='utf-8')
    (ROOT/'edge/routes.mjs').write_text('// Generated by scripts/sync-locales.py.\nexport const homeLanguages = '+json.dumps(home)+';\nexport const pageLanguages = '+json.dumps(list(LANGUAGES))+';\nexport const legacyPaths = '+json.dumps(legacy,indent=2)+';\nexport const pagePaths = '+json.dumps([p['url'] for p in pages.values()],indent=2)+';\n',encoding='utf-8')
    entries = [('/',dict(families['index'], **{'x-default':'/'}))]
    for page in pages.values():
        family=families[page['family']]
        default='/' if page['family']=='index' else family.get('en',next(iter(family.values())))
        entries.append((page['url'],dict(family, **{'x-default':default})))
    sitemap=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for url,alts in entries:
        sitemap.append(f'  <url><loc>{ORIGIN}{url}</loc>')
        sitemap.extend(f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{ORIGIN}{path}" />' for lang,path in alts.items())
        sitemap.append('  </url>')
    (ROOT/'sitemap.xml').write_text('\n'.join(sitemap+['</urlset>','']),encoding='utf-8')
    (ROOT/'scripts/site-pages.json').write_text(json.dumps(pages,indent=2)+'\n',encoding='utf-8')
    print(f'Synchronized {len(pages)} canonical pages and {len(legacy)} legacy paths.')

if __name__=='__main__': main()
