# -*- coding: utf-8 -*-
"""Zgradi en/index.html, nl/index.html in th/index.html iz slovenske naslovnice.

Slovenska stran je edini vir resnice za zgradbo. Tu se zamenja samo besedilo,
poti do datotek (podstran je eno mapo globlje) in seznam drzav.
"""
import importlib.util, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent          # korenska mapa spletne strani
spec = importlib.util.spec_from_file_location('strings', HERE / 'strings.py')
S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
COUNTRIES = json.loads((HERE / 'countries.json').read_text(encoding='utf-8'))

LANGS = {'en': 0, 'nl': 1, 'th': 2}


def flexible(key):
    """Vzorec, ki se ujema tudi, ce je besedilo v HTML prelomljeno cez vec vrstic."""
    return re.compile(r'\s+'.join(re.escape(w) for w in key.split()))


def countries_js(lang, indent='    '):
    rows, line = [], []
    for code, (name, tax) in COUNTRIES[lang].items():
        line.append("%s:['%s','%s']" % (code, name.replace("'", "\\'"), tax.replace("'", "\\'")))
        if len(line) == 3:
            rows.append(indent + ', '.join(line) + ','); line = []
    if line:
        rows.append(indent + ', '.join(line))
    return '\n'.join(rows).rstrip(',')


def build(lang):
    i = LANGS[lang]
    s = (ROOT / 'index.html').read_text(encoding='utf-8')

    # ── 1. besedilo ──────────────────────────────────────────────────────
    # Najdaljsi kljuci gredo prvi, sicer "Zakaj" pozre "Zakaj Billero".
    pairs = list(S.T.items()) + list(S.ATTRS.items())
    for key, val in sorted(pairs, key=lambda kv: -len(kv[0])):
        s = flexible(key).sub(lambda m, v=val[i]: v, s)

    # ── 2. jezik in kanonicni naslovi ────────────────────────────────────
    s = s.replace('<html lang="sl">', f'<html lang="{lang}">')
    s = s.replace('<link rel="canonical" href="https://billero.app/">',
                  f'<link rel="canonical" href="https://billero.app/{lang}/">')
    s = s.replace('<meta property="og:url" content="https://billero.app/">',
                  f'<meta property="og:url" content="https://billero.app/{lang}/">')
    s = s.replace('<meta property="og:locale" content="sl_SI">',
                  f'<meta property="og:locale" content="{S.LOCALE[lang]}">')

    # ── 3. preklopnik jezikov ────────────────────────────────────────────
    langs = ['      <a href="../index.html">SL</a>']
    for code in ('en', 'nl', 'th'):
        href = 'index.html' if code == lang else f'../{code}/index.html'
        cur = ' aria-current="page"' if code == lang else ''
        langs.append(f'      <a href="{href}"{cur}>{code.upper()}</a>')
    block = re.search(r'    <div class="langs">\n.*?\n    </div>', s, re.S)
    s = s[:block.start()] + '    <div class="langs">\n' + '\n'.join(langs) + '\n    </div>' + s[block.end():]

    # ── 4. poti: podstran je eno mapo globlje ────────────────────────────
    s = s.replace('src="img/', 'src="../img/')
    s = s.replace('href="release-notes.html"', f'href="../release-notes-{lang}.html"')
    # Trgovina brez oznake drzave, sicer nizozemski obiskovalec pristane v slovenski trgovini.
    s = s.replace('https://apps.apple.com/si/app/billero/id6760204857',
                  'https://apps.apple.com/app/id6760204857')

    # ── 5. seznam drzav na zemljevidu ────────────────────────────────────
    block = re.search(r'  var countries = \{\n(.*?)\n  \};', s, re.S)
    s = s[:block.start(1)] + countries_js(lang) + s[block.end(1):]

    # Opomba za tistega, ki bo datoteko odprl: urejaj slovensko, ne te.
    s = s.replace('<!DOCTYPE html>',
                  '<!DOCTYPE html>\n<!-- Zgrajeno iz /index.html. Besedilo popravi tam in\n'
                  '     v ai/i18n/strings.py, nato pozeni ai/i18n/gen_langs.py. -->', 1)

    (ROOT / lang / 'index.html').write_text(s, encoding='utf-8')

    left = sorted({m.group(0) for m in re.finditer(r'[čšžćđČŠŽ]\w*', s)})
    print(f'{lang}/index.html  {len(s):>6} B   sumljivi slovenski ostanki: {left or "brez"}')


if __name__ == '__main__':
    for lang in sys.argv[1:] or LANGS:
        build(lang)
