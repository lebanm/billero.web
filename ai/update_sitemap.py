"""Osvezi sitemap.xml: doda <lastmod> iz zadnjega commita za vsako datoteko in
opozori na strani, ki v sitemapu manjkajo ali kazejo v prazno.

  python3 ai/update_sitemap.py
"""
import pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = 'https://billero.app/'
SITEMAP = ROOT / 'sitemap.xml'

# Interne strani, ki jih deploy_web.bat itak ne objavi.
NOT_PUBLISHED = {'dillero-concept.html'}


def to_path(loc):
    rel = loc[len(BASE):]
    return ROOT / (rel + 'index.html' if rel.endswith('/') or rel == '' else rel)


def last_commit(path):
    out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', str(path.relative_to(ROOT))],
                         cwd=ROOT, capture_output=True, text=True).stdout.strip()
    return out or None


def main():
    xml = SITEMAP.read_text(encoding='utf-8')
    listed, missing_file, updated = set(), [], 0

    def fix(block):
        nonlocal updated
        loc = re.search(r'<loc>([^<]+)</loc>', block.group(0)).group(1)
        listed.add(loc)
        path = to_path(loc)
        if not path.exists():
            missing_file.append(loc)
            return block.group(0)
        date = last_commit(path)
        if not date:
            return block.group(0)
        updated += 1
        b = re.sub(r'\s*<lastmod>[^<]*</lastmod>', '', block.group(0))
        return b.replace('</loc>', f'</loc>\n    <lastmod>{date}</lastmod>', 1)

    xml = re.sub(r'<url>.*?</url>', fix, xml, flags=re.S)
    SITEMAP.write_text(xml, encoding='utf-8')

    not_listed = []
    for f in sorted(ROOT.rglob('*.html')):
        if any(p in ('.git', 'ai') for p in f.relative_to(ROOT).parts):
            continue
        rel = f.relative_to(ROOT).as_posix()
        canonical = BASE + (rel[:-len('index.html')] if rel.endswith('index.html') else rel)
        if canonical not in listed and rel not in NOT_PUBLISHED:
            not_listed.append(rel)

    print(f'<lastmod> nastavljen na {updated} od {len(listed)} naslovov')
    if missing_file:
        print('v sitemapu, a datoteke ni:', *missing_file, sep='\n  ')
    if not_listed:
        print('datoteka obstaja, a je ni v sitemapu:', *not_listed, sep='\n  ')
    return 1 if missing_file else 0


if __name__ == '__main__':
    sys.exit(main())
