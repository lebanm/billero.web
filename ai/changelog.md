# AI Changelog — billero.web

Povzetek vseh sprememb, ki jih je naredil AI ali Cursor.

## 2026-11-24 (Codex, WEB-010 — ZA_PREGLED, krog 1/6)

Prednostno po Matejevem naročilu: samostojni `/app` s preusmeritvijo iPhone/iPad
v App Store in Android v Google Play; računalnik prikaže oba gumba. Kampanje
so dovoljene samo iz `app/store-links.js`, neznana pomeni `web`. Jezik `l`
podpira es/en/sl/de/nl/th, privzeto es; brez JS ostaneta španska gumba z `web`.
Stran ima noindex, ne uporablja piškotkov ali zunanjih skript in potrebuje samo
pet datotek v `app/`. Preusmeritev uporablja replace, gumba ostaneta nadomestilo.

Šest domačih strani uporablja Apple URL brez države; en/es dobita oznake
kampanje za obe trgovini. `scripts/update-store-links.mjs` vzdržuje povezave
iz skupnega vira. Odstranjene so neomejene navedbe free/gratis ob prenosu
in neizmerjena časovna obljuba na en. Omejitve Free v ceniku/FAQ ostajajo.

Preverjeno: 178/178 testov, check-site 80 vsebinskih strani + vstopna + /app,
3.145 lokalnih povezav, 0 napak. Playwright brez Workerja: 30 preusmeritev
(tudi UA Facebook/Instagram/TikTok in iPad desktop), 24 postavitev, tipkovnica,
4 nadomestni tokovi, Nazaj brez zanke, brez zunanjih zahtev/piškotkov/shrambe.
Javni /app, /app/ in /app/index.html trenutno vrnejo 404; www vrne 301
z ohranjenim queryjem in nato 404. To je preverba pred objavo, ne objave rešitve.

Dokazi in navodilo za ločeno objavo: billero.app/docs/strategy/evidence/WEB-010/.
WEB-009 ostaja v pregledu; njegovih vodičev, edge, pravilnikov, sitemapa in
deploy_web.bat nismo spreminjali. Brez commita, pusha ali objave.

---

## 2026-11-23 (Codex, WEB-009 — ZA_PREGLED, krog 1/6)

Šest stvarnih vodičev o vsebini računa: Slovenija sl/en, ZDA en/es in Nemčija
de/en. Ločeni so obvezni podatki in praktična priporočila, uradni pravni viri,
preverba november 2026, pet vidnih FAQ z enakim JSON-LD ter meje Billera 1.8.1.
SI izrecno razloži kartice/gotovino in odsotnost davčnega potrjevanja; DE razlikuje
izdajo in prejem E-Rechnung, izjemo Kleinunternehmer in prehodna roka; US pojasni
EIN/W-9, sales tax in angleški Letter PDF pri španskem vmesniku.

Uredniška vsebina in citacije so v scripts/invoice-guides.json; renderer pripravi
statični HTML in FAQPage iz istih podatkov. Inventar podpira gnezdene in prevedene
poti s skupino po državi, x-default je vedno angleška različica istega trga.
Dodane so povezave v nogah sl/en/de/es, llms.txt ter šest vnosov v sitemap.
Obstoječa vsebina in Workerjev algoritem sta ohranjena; W8-4 je predan posebej.

Poti: šest HTML vodičev v sl/en/de/es, css/invoice-guide.css, štiri domače strani,
scripts/{invoice-guides.json,build-invoice-guides.py,sync-locales.py,site-pages.json,
check-site.py,validate-schema.mjs,check-invoice-guides.mjs,audit-invoice-guides.mjs},
tests/invoice-guides.test.mjs, edge/routes.mjs, sitemap.xml, llms.txt,
ai/context.md, ai/changelog.md. Skupna dokumentacija in dokazi so v billero.app.

Preverjeno: npm test 31/31; 80 strani/3.135 povezav/81 sitemap URL-jev brez napak;
schema.org vseh 6 FAQ brez napak/opozoril; 24 postavitev (360/390/768/1440),
6 preklopov jezika in tipkovnica FAQ brez napak. Prelivanje DE tabele pri 360 px
popravljeno. Mobilni Lighthouse SI/US/DE: SEO in accessibility po 100/100.
Ponovno generiranje je bajtno enako. Dokazi WEB-009 ostanejo pod 5 MB, brez
arhivov in dolgih posnetkov celih strani; razlike v pravnih podatkih aplikacije
so zapisane za Claude. Koda aplikacije je nespremenjena.

Brez commita, pusha ali objave. WEB-009 sledi objavi WEB-008 in ločenemu naročilu;
ostajajo POL-1, Cloudflare/čisti URL-ji, Worker → vsebina in izdaja 1.8.1.

---

## 2026-11-23 (Codex, WEB-008 W8-4 — krog 3/6)

Generator iz inventarja izpelje 56 nadomestnih 301: manjkajoče domače strani
na vstopni `/`, kontakt/donacije na obstoječi angleški strani. Vključene so
različice z `.html` in čisti URL-ji. Ob dodatku prevoda se fallback odstrani.
Workerjeva logika ostaja nespremenjena; spremeni se generirani `legacyPaths`.

Poti: scripts/sync-locales.py, edge/routes.mjs, tests/language-router.test.mjs,
tests/missing-pages.test.mjs, tests/fixtures/gsc-404-2026-11-23.csv, ai/changelog.md.
Preverjeno: npm test 29/29; check-site 74 strani, 2.977 povezav, 0 napak;
21/22 GSC poti doseže stran, pokvarjena `/mes.…` ostane 404. Test simulira
obstoječi www prehod z začetkom na glavni domeni; ni preizkus objavljene rešitve.
Dokazi: billero.app/docs/strategy/evidence/WEB-008/round-3/.
Brez commita, pusha ali objave. WEB-009 se nadaljuje po tej ločeni predaji.

---

## 2026-11-23 (Codex, WEB-008 — popravki MSG-163, krog 2/6)

Na en/es prvi zaslon in koraki poudarjajo splošni payment QR oziroma QR de pago,
plačilno povezavo in bančne podatke. UPN/SEPA sta omejena na evropsko podrobnost
v FAQ oziroma kartici. Angleška kartica Tax calculation pojasni VAT, GST/HST in
sales tax glede na državo izdajatelja, izbrano stopnjo in nastavitve računa.
Španska domača stran uporablja ameriško izrazje (estimados, trabajadores
independientes, agrega), tudi v metapodatkih, FAQ/JSON-LD in sliki za deljenje;
oznaki jezika sta es-US/es_US. Pot /es/ in splošni hreflang es ostajata.

Spremenjeno: en/index.html, es/index.html, img/web008/og-es.jpg,
scripts/validate-schema.mjs (izbirna ciljna mapa dokazil), ai/changelog.md.
Preverjeno: npm test 25/25; check-site 74 strani in 2.977 povezav brez napak;
schema.org vseh 6 strani brez napak/opozoril; en/es pri petih širinah brez
prelivanja, odrezanega besedila, nedelujočih slik ali napak konzole; vidnih 7 FAQ
na vsaki strani se ujema z JSON-LD. Dokazi drugega kroga so ločeni v
billero.app/docs/strategy/evidence/WEB-008/round-2/.

Brez commita, pusha ali objave. Predobjavne odvisnosti iz MSG-163 ostajajo Mateju.

---

## 2026-11-23 (Codex, WEB-008 — ZA_PREGLED)

Slovenske kanonične strani so pod `/sl/`; koren je jezikovni izbirnik. Cloudflare
Worker pripravi HTTP 302 po piškotku/glavi in 301 za stare URL-je; obstoječe
gostovanje vsebine ostane. Skupen generator vzdržuje canonical, hreflang, jezikovne
preklopnike, 75 URL-jev zemljevida strani in seznam preusmeritev. Piškotek se
spremeni samo ob ročni izbiri jezika. Dodani sta nemška in španska domača stran.

Šest domačih strani nagovarja podjetja z eno osebo ter usklajuje besedila in FAQ z
1.8.1: prvih 10 računov in predračunov skupaj, predračun v Free, 53 držav v šifrantu
in 12 jezikov. Umaknjene so nepreverjene plačljive cene in nepodprte obljube iz
paketov. Dodani so Organization/SoftwareApplication/FAQPage JSON-LD in llms.txt,
8 optimiziranih WebP kartic iz posnetkov trgovin ter 6 lokaliziranih OG slik.

Spremenjeno: javni HTML (ciljno URL-ji/navigacija/metapodatki; domače strani tudi
vsebina), sitemap.xml, ai/context.md, ta dnevnik in .gitignore. Novo: sl/**,
de/index.html, es/index.html, */release-notes.html, css/language.css,
js/language*.js, img/web008/**, edge/**, scripts/**, tests/**, package*.json,
llms.txt in ai/WEB-008-hosting.md. Obstoječe delo je ohranjeno v začetnem posnetku.

Preverjeno: 25 testov usmerjanja, 2.977 lokalnih povezav, 74 lokaliziranih strani,
30 odzivnih postavitev in jezikovni/tipkovnični tokovi. Besedilo 68 podstrani
nespremenjeno. Schema.org: 6/6 brez napak/opozoril. Mobilni Lighthouse en/sl:
SEO 100/100, dostopnost 100/100; performance en 67→67, sl 42→69.
Dokazi: billero.app/docs/strategy/evidence/WEB-008/.

Brez commita, pusha ali objave. Pred objavo je treba potrditi razpoložljivost
1.8.1, pregled in Cloudflare konfiguracijo; sveži posnetki sl/de/nl/th še manjkajo.
robots.txt, vsebina pravilnikov/pogojev, predaja-9k7m2f in deploy_web.bat so ohranjeni.

---

## 2026-09-03 (Codex — prenova landing strani in SEO)

**Task:** Prenova štirih lokaliziranih domačih strani v sodobno, odzivno in
prodajno usmerjeno Billero landing stran z natančnimi produktnimi trditvami.

**Spremenjene datoteke:** `index.html`, `en/index.html`, `nl/index.html`,
`th/index.html`, `css/landing.css`, `js/landing.js`, `ai/context.md`,
`ai/changelog.md`; skupna koordinacija v
`billero.app/docs/ai/current-task.md` in `inbox-claude.md`.

**Glavne spremembe:** nov hero in navigacija, potek uporabe, galerija zaslonov,
funkcije, cenik Free/Plus/Pro, pojasnilo zasebnosti, 47 trgov s tekstovnim
fallbackom, FAQ in zaključni CTA. Dodani so lokalizirani meta podatki,
canonical/hreflang, Open Graph/X in JSON-LD za aplikacijo ter FAQ.

**Preverjanje:** lokalni HTTP pregled vseh jezikov brez napak v konzoli;
odzivni pregled pri 360, 390, 768, 1024 in 1440 px brez horizontalnega
overflowa; statični pregled HTML povezav, slik in strukturiranih podatkov.

---

## 2026-09-02 (Codex — skupna koordinacija s Claude)

**Task:** Povezava spletnega repozitorija z enotnim Billero protokolom za
Codex ↔ Claude pregled.

**Spremenjene datoteke:** `AGENTS.md`, `CLAUDE.md`, `ai/context.md`,
`ai/changelog.md`; skupno stanje ostaja v `billero.app/docs/ai/`.

---

## 2026-03-09 10:55 (Cursor)

**Task:** Inicializacija AI pravil za billero.web (context.md, coding_rules.md, .cursorrules)

**Spremenjene datoteke:** .cursorrules, ai/context.md, ai/coding_rules.md, ai/changelog.md

---

## 2026-11-09 (Codex, WEB-007)

Pripravljena lokalna spletna posodobitev za Billero 1.8.0. Štiri domače strani
usklajujejo več podjetij v paketu Pro, samodejno kopijo z geslom v paketu Plus
in mejo Free (10 računov skupaj), tudi v vidnem FAQ in JSON-LD.

Dvanajst pravilnikov razlikuje samodejno in ročno kopijo ter izvoz z zaslona
Paketi. Opisujejo varno shrambo gesla, lokalno ločitev podjetij in nešifrirano
kazalo skupne kopije. Nakupi so opisani prek trgovin Apple in Google.
V dvanajst opomb izdaje so prenesena manjkajoča poglavja 1.6.2, 1.7.0,
1.7.1 in 1.8.0 iz aplikacije.

Preverjeno: lokalne povezave in sidra, JSON-LD ter ohranitev obstoječih
razdelkov opomb v vseh 28 datotekah. Prikaz v brskalniku ostaja za preveriti:
lokalna povezava je bila omejena, odobritev za Chrome pa je potekla.
V pravilnikih je označen vpis dejanskega datuma ob objavi.

---
