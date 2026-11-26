"""Check canonical/hreflang reciprocity, local links, images and visible/schema FAQ parity."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit
import json,re,xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
ORIGIN='https://billero.app'
pages=json.loads((ROOT/'scripts/site-pages.json').read_text(encoding='utf-8'))
byurl={page['url']:filename for filename,page in pages.items()}
byurl['/']='index.html'
errors=[]
def check(condition,message):
    if not condition: errors.append(message)

class Document(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True); self.links=[];self.images=[];self.alts={};self.canonical=[];self.ids=set();self.languages=[];self.h1=0;self.scripts=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
        if tag=='link' and a.get('rel')=='alternate':
            check(a.get('hreflang') not in self.alts,'Duplicate hreflang');self.alts[a.get('hreflang')]=a.get('href')
        if tag=='a' and 'data-lang' in a:self.languages.append(a)
        if tag=='img':self.images.append(a)
        if tag=='script':self.scripts.append(a)
        if 'href' in a:self.links.append(a['href'])
        if 'src' in a:self.links.append(a['src'])

docs={filename:Document((ROOT/filename).read_text(encoding='utf-8')) for filename in byurl.values()}
countlinks=0
for url,filename in byurl.items():
    doc=docs[filename]; page=pages.get(filename,{'family':'index','lang':'en'})
    family={p['lang']:ORIGIN+p['url'] for p in pages.values() if p['family']==page['family']}
    family['x-default']=ORIGIN+'/' if page['family']=='index' else family.get('en',next(iter(family.values())))
    check(doc.canonical==[ORIGIN+url],f'{filename}: canonical {doc.canonical}')
    check(doc.alts==family,f'{filename}: alternatives differ: {doc.alts}')
    check(doc.h1==1,f'{filename}: expected one h1')
    check({a['data-lang'] for a in doc.languages}==set(family)-{'x-default'},f'{filename}: incomplete language picker')
    check(any(s.get('src')=='/js/language.js' for s in doc.scripts),f'{filename}: missing cookie script')
    for img in doc.images:
        check('alt' in img,f'{filename}: missing image alt')
        if page['family']=='index':check('width' in img and 'height' in img,f'{filename}: image dimensions missing')
    for link in doc.links:
        target=urlsplit(urljoin(ORIGIN+url,link))
        if target.netloc!='billero.app' or target.scheme not in ['http','https']:continue
        countlinks+=1
        dest=byurl.get(target.path,target.path.lstrip('/'))
        check((ROOT/dest).is_file(),f'{filename}: missing {link} -> {dest}')
        if target.fragment and dest in docs:check(target.fragment in docs[dest].ids,f'{filename}: missing anchor {link}')
    is_guide=page['family'].startswith('invoice-requirements-')
    if (page['family']=='index' and url!='/') or is_guide:
        text=(ROOT/filename).read_text(encoding='utf-8')
        data=json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',text,re.S)[1]);graph=data['@graph']
        expected={'FAQPage'} if is_guide else {'SoftwareApplication','Organization','FAQPage'}
        check({o['@type'] for o in graph}==expected,f'{filename}: schema types')
        if not is_guide:
            app=next(o for o in graph if o['@type']=='SoftwareApplication')
            check(app['offers']['price']=='0' and app['offers']['name']=='Free',f'{filename}: unverified paid offer')
        faq=next(o for o in graph if o['@type']=='FAQPage')['mainEntity']
        fragment=re.search(r'<div class="faq-list">(.*?)</div>',text,re.S)[1]
        import html
        visible=[(html.unescape(q),html.unescape(a)) for q,a in re.findall(r'<summary>(.*?)</summary><p>(.*?)</p>',fragment,re.S)]
        check(visible==[(q['name'],q['acceptedAnswer']['text']) for q in faq],f'{filename}: FAQ schema differs from visible answers')
        check(4<=len(faq)<=6 if is_guide else 5<=len(faq)<=8,f'{filename}: FAQ count')

tree=ET.parse(ROOT/'sitemap.xml');ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','x':'http://www.w3.org/1999/xhtml'}
locations={}
for node in tree.findall('s:url',ns):
    url=node.find('s:loc',ns).text;alts={n.attrib['hreflang']:n.attrib['href'] for n in node.findall('x:link',ns)}
    check(url not in locations,'Duplicate sitemap URL '+url);locations[url]=alts
    path=urlsplit(url).path
    check(path in byurl,'Sitemap URL not canonical '+url)
    if path in byurl:check(alts==docs[byurl[path]].alts,'Sitemap alternates mismatch '+url)
check(set(locations)=={ORIGIN+url for url in byurl},'Sitemap incomplete')
# /app is a standalone noindex utility, not a localized content family.
download_text=(ROOT/'app/index.html').read_text(encoding='utf-8')
download=Document(download_text)
check(download.h1==1,'app/index.html: expected one h1')
check(bool(re.search(r'<meta name="robots" content="noindex, follow">',download_text)),'app/index.html: missing noindex')
check('<noscript>' in download_text,'app/index.html: missing noscript fallback')
check({'apple','play'}<=download.ids,'app/index.html: missing store buttons')
check(not any(urlsplit(url).path.rstrip('/') in ['/app','/app/index.html'] for url in locations),'app must not be in sitemap')
for script in download.scripts:
    check(script.get('src','').startswith('/app/'),'app/index.html: external or inline script')
for link in download.links:
    target=urlsplit(urljoin(ORIGIN+'/app/',link))
    if target.netloc!='billero.app':continue
    countlinks+=1
    dest=target.path.lstrip('/')
    if dest.endswith('/'):dest+='index.html'
    check(dest.startswith('app/') and (ROOT/dest).is_file(),f'app/index.html: missing or non-standalone asset {link}')
check((ROOT/'llms.txt').is_file(),'llms.txt missing')
print(json.dumps({'canonical_pages':len(pages),'entry_pages':1,'download_pages':1,'local_links_checked':countlinks,'sitemap_urls':len(locations),'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
