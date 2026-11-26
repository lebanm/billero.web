"""Render the six reviewed country guides and identical visible/structured FAQs.

Edit invoice-guides.json, run this script, then sync-locales.py and check-site.py.
The content is editorial data, not a legal-rules engine or app-data import.
"""
from pathlib import Path
from html import escape as esc
import json

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT/'scripts/invoice-guides.json').read_text(encoding='utf-8'))
UI = {
    'sl': dict(skip='Preskoči na vsebino', toc='Na tej strani', faq='Pogosta vprašanja', sources='Uradni viri', source='Vir', checked='Preverjeno: november 2026', guide='Vodič za izdajanje računov', home='Domača stran', help='Navodila', privacy='Zasebnost', terms='Pogoji uporabe', disclaimer='Splošne informacije, preverjene 23. novembra 2026. To ni pravni ali davčni nasvet. Za svoj primer preveri veljavne predpise in se po potrebi obrni na računovodjo ali davčnega svetovalca.'),
    'en': dict(skip='Skip to content', toc='On this page', faq='Frequently asked questions', sources='Official sources', source='Source', checked='Checked: November 2026', guide='Invoicing guide', home='Home', help='User guide', privacy='Privacy', terms='Terms of use', disclaimer='General information checked on November 23, 2026. This is not legal or tax advice. Check the rules for your situation and consult an accountant or tax adviser when needed.'),
    'de': dict(skip='Zum Inhalt', toc='Auf dieser Seite', faq='Häufige Fragen', sources='Amtliche Quellen', source='Quelle', checked='Geprüft: November 2026', guide='Ratgeber zur Rechnungsstellung', home='Startseite', help='Anleitung', privacy='Datenschutz', terms='Nutzungsbedingungen', disclaimer='Allgemeine Informationen, geprüft am 23. November 2026. Keine Rechts- oder Steuerberatung. Prüfe die Vorschriften für deinen Fall und wende dich bei Bedarf an eine Steuerberatung.'),
    'es': dict(skip='Saltar al contenido', toc='En esta página', faq='Preguntas frecuentes', sources='Fuentes oficiales', source='Fuente', checked='Verificado: noviembre de 2026', guide='Guía de facturación', home='Inicio', help='Guía de uso', privacy='Privacidad', terms='Condiciones', disclaimer='Información general verificada el 23 de noviembre de 2026. No es asesoría legal ni fiscal. Revisa las reglas de tu caso y consulta a un contador o asesor fiscal cuando sea necesario.'),
}

def render(page):
    ui = UI[page['lang']]
    used = []
    def refs(keys):
        if not keys: return ''
        links = []
        for key in keys:
            source = DATA['sources'][key]
            if key not in used: used.append(key)
            links.append(f'<a href="{esc(source["url"], quote=True)}">{esc(source["label"])}</a>')
        return f'<small class="guide-source">{ui["source"]}: '+ ' · '.join(links)+'</small>'
    def block(item):
        kind = item['type']
        if kind in ('p', 'h3'): result=f'<{kind}>{esc(item["text"])}</{kind}>'
        elif kind=='quote': result='<blockquote><p>'+esc(item['text'])+'</p></blockquote>'
        elif kind=='ul': result='<ul>\n'+''.join('<li>'+esc(s)+'</li>\n' for s in item['items'])+'</ul>'
        elif kind=='table':
            result='<table><thead><tr>'+''.join('<th scope="col">'+esc(s)+'</th>' for s in item['headers'])+'</tr></thead><tbody>'
            result+=''.join('<tr>'+''.join(('<th scope="row">'+esc(s)+'</th>') if n==0 else '<td>'+esc(s)+'</td>' for n,s in enumerate(row))+'</tr>' for row in item['rows'])+'</tbody></table>'
        else: raise ValueError(kind)
        return result+refs(item.get('refs',[]))
    lang=page['lang']; url='https://billero.app/'+page['file'][:-5]
    schema={'@context':'https://schema.org','@graph':[{'@type':'FAQPage','@id':url+'#faq','inLanguage':'es-US' if lang=='es' else lang,'mainEntity':[{'@type':'Question','name':f['q'],'acceptedAnswer':{'@type':'Answer','text':f['a']}} for f in page['faqs']]}]}
    toc=''.join(f'<a href="#{s["id"]}">{esc(s["title"])}</a>' for s in page['sections'])+f'<a href="#faq">{ui["faq"]}</a><a href="#sources">{ui["sources"]}</a>'
    hero=refs(page['answerRefs'])
    note=refs(page['noteRefs'])
    sections='\n'.join(f'<section id="{s["id"]}"><h2>{esc(s["title"])}</h2>\n'+ '\n'.join(block(b) for b in s['blocks'])+'</section>' for s in page['sections'])
    faq='\n'.join('<details><summary>'+esc(f['q'])+'</summary><p>'+esc(f['a'])+'</p>'+refs(f['refs'])+'</details>' for f in page['faqs'])
    sources=''.join('<li><a href="'+esc(DATA['sources'][k]['url'],quote=True)+'">'+esc(DATA['sources'][k]['label'])+'</a></li>' for k in used)
    title=esc(page['title']); description=esc(page['description'],quote=True)
    return f'''<!DOCTYPE html>
<!-- Generated from scripts/invoice-guides.json by build-invoice-guides.py. -->
<html lang="{'es-US' if lang=='es' else lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | Billero</title>
  <meta name="description" content="{description}">
  <meta name="theme-color" content="#050b18">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="https://billero.app/img/icons/billero_512.png">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/img/icons/billero_32.png">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/invoice-guide.css">
  <link rel="stylesheet" href="/css/language.css">
  <script src="/js/language.js" defer></script>
  <script type="application/ld+json">{json.dumps(schema,ensure_ascii=False,indent=2)}</script>
</head>
<body class="invoice-guide">
  <a class="guide-skip" href="#main">{ui['skip']}</a>
  <div class="container">
    <header>
      <div class="logo"><a href="/{lang}/"><img src="/img/icons/billero_256.png" alt="" width="36" height="36">Billero</a></div>
      <nav class="locale-nav"></nav>
    </header>
    <main id="main">
      <div class="guide-hero">
        <span class="guide-eyebrow">{ui['guide']} · {esc(page['market'])}</span>
        <h1>{title}</h1>
        <p class="guide-answer">{esc(page['answer'])}</p>{hero}
        <p class="guide-meta"><time datetime="2026-11-23">{ui['checked']}</time> · Billero 1.8.1</p>
        <p class="guide-scope">{esc(page['scope'])}</p>
      </div>
      <div class="guide-layout">
        <nav class="guide-toc" aria-label="{ui['toc']}"><strong>{ui['toc']}</strong>{toc}</nav>
        <article class="guide-article" aria-label="{title}">
          <aside class="guide-note"><strong>{esc(page['noteTitle'])}</strong><p>{esc(page['note'])}</p>{note}</aside>
          {sections}
          <section id="faq"><h2>{ui['faq']}</h2><div class="faq-list">{faq}</div></section>
          <section id="sources"><h2>{ui['sources']}</h2><ul class="guide-sources">{sources}</ul><p class="guide-disclaimer">{ui['disclaimer']}</p></section>
        </article>
      </div>
    </main>
    <footer class="guide-footer"><nav aria-label="Billero"><a href="/{lang}/">{ui['home']}</a><a href="/{lang}/user-guide">{ui['help']}</a><a href="/{lang}/privacy-policy">{ui['privacy']}</a><a href="/{lang}/terms-of-use">{ui['terms']}</a></nav><p>© 2026 Billero · B-DataFit, Matej Leban s.p.</p></footer>
  </div>
</body>
</html>
'''

if __name__=='__main__':
    for page in DATA['pages']:
        target=ROOT/page['file']; target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(render(page),encoding='utf-8')
    print(f'Rendered {len(DATA["pages"])} country guides. Next: sync-locales.py.')
