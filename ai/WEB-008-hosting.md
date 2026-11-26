# WEB-008 — gostovanje in poznejša objava

Stanje 2026-11-23: lokalno pripravljeno za pregled. Ni objavljeno.

## Izbrana osnova

`billero.web` ostaja na `main` @ `abbec4dc3312796463c0cd594902a6f4f0507522`.
Osnova vključuje obstoječe necommitano delo (WEB-007, pravilniki in prenova domačih
strani). Pred spremembami je shranjeno v `billero.app/docs/strategy/evidence/WEB-008/00-baseline.zip`,
z ločenim diffom in hashi. Oddaljena veja ni bila združena, delovno drevo ni bilo
ponastavljeno. Poti `predaja-9k7m2f/`, skrivnosti in FTP skripta niso spremenjene.

Pomembna razlika osnove: lokalni `origin/claude/awesome-franklin-q0qc98` kaže na
`793e9d89364d31bd6ccbd48630f913ebbe7b01d6`, to je novejši pravilnik 1.8.1, ki je
po vhodu MSG-161 že objavljen. Lokalni pravilniki iz ohranjenega dela WEB-007 se
od njega razlikujejo. WEB-008 jih ni nadomestil, ker je vsebinsko spreminjanje
pravilnikov izrecno zunaj obsega in gre za obstoječe delo. Pred objavo je obvezna
uskladitev tega izvora: objava priloženega statičnega paketa brez te uskladitve bi
lahko prepisala novejše javne pravilnike s starejšim lokalnim besedilom. Dva
primerjalna diffa sta shranjena kot `00-published-policy-*.diff` v dokazilih.

## Arhitektura

Vsebina ostaja statični HTML/CSS/JS na obstoječem izvoru. HTTP-glave javne strani
potrjujejo Cloudflare in obstoječ 307 `.html` → čist URL; iz njih ni mogoče
ugotoviti upravljalske konfiguracije izvora. Repozitorij vsebuje FTP postopek,
ne pa `.htaccess`, konfiguracije Pages ali že obstoječega spletnega Workerja.

Izvedba uporablja `edge/language-router.mjs` kot Worker na poti `billero.app/*`
pred obstoječim izvorom, brez selitve gostovanja. Ta način opisuje uradna
[dokumentacija Cloudflare Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/).
`fetch(request)` vse druge zahteve nespremenjene pošlje obstoječemu izvoru.

- Samo `/`: 302 po piškotku `lang`, nato po glavi Accept-Language (upoštevani q),
  sicer `/en/`. `Cache-Control: private, no-store`, CDN no-store in
  `Vary: Accept-Language, Cookie` preprečujejo deljenje izbire med obiskovalci.
- Stari slovenski URL-ji, vključno z `/index.html` in `/index`: 301 na `/sl/...`.
- Stare `release-notes-<jezik>` poti: 301 na `/<jezik>/release-notes`.
- `.html` aliasi obstoječih prevedenih strani: 301 na čist URL istega jezika.
- Prevedene kanonične poti se ne preusmerjajo po jeziku. `/motd`,
  `/onboarding-motd`, sredstva in neznane poti gredo nespremenjeni na izvor.
- Ročni jezikovni preklop shrani piškotek za leto, Path=/, SameSite=Lax, na HTTPS
  tudi Secure. Navadno odpiranje povezave ne prepiše izbire.
- Brez Workerja ima `/` nevtralni HTML in sinhroni skript pred izrisom za
  navigator.languages. To je uporabniški fallback, **ni dokaz HTTP 302**.
  Brez JavaScripta in brez Workerja ostane dostopen tekstovni izbirnik.

`scripts/sync-locales.py` bere dejansko prisotne strani. Trenutno je domačih
jezikov šest (sl/en/de/es/nl/th), podstrani pa dvanajst. Japonski jezik iz piškotka
ali samostojne glave na `/` varno pade na angleščino, ker `/ja/` nima domače strani.
Za domače strani je x-default `/`, za podstrani ustrezna angleška podstran.

## Lokalno preverjanje

```text
npm ci
python scripts/sync-locales.py
npm test
npm run check:site
npm run check:worker
npm run preview
```

Predogled: `http://127.0.0.1:8788`. Uporablja isto funkcijo `handleRequest` kot
Worker, z lokalnim statičnim izvorom. Node HTTP preizkus ni preizkus žive
Cloudflare konfiguracije; Wrangler dry-run potrdi pakiranje za Worker runtime.
`node scripts/browser-qa.mjs` in `node scripts/validate-schema.mjs` shranita
brskalniška ter zunanja schema.org dokazila. Testni brskalnik: Playwright Chromium.

## Postopek šele po izrecnem naročilu objave

1. Claude pregleda WEB-008; Matej potrdi objavo. Preveri dejansko dostopnost
   1.8.1 v trgovinah — ta spletna besedila so priprava za 1.8.1, POPIS pa jo še
   označuje kot neobjavljeno. Prejšnje spremembe pravilnikov (WEB-007) imajo svoj
   opomnik za datum objave; v WEB-008 njihovo besedilo ni bilo spremenjeno.
2. Preveri aktivno cono, DNS/izvor, že obstoječe Workers Routes, Redirect Rules,
   Bulk Redirects in cache pravila. Širši route ne sme izpodriniti obstoječih
   `/motd` ali drugih aplikacijskih poti. Preusmeritvena pravila lahko tečejo pred
   Workerjem; morebitni konflikt je treba razrešiti pred preklopom.
3. Najprej prenesi javne datoteke na **preverjeni obstoječi izvor**. Prenos mora
   vsebovati nove jezikovne mape in sredstva. Dokazni `public-site.zip` je pripravljen
   z izrecnim seznamom javnih datotek, brez `.env`, `.git`, predaje, razvojnih orodij
   in koordinacijskih datotek. Ohraniti mora morebitne žive datoteke zunaj tega seznama.
4. Obstoječega `deploy_web.bat` ne zaganjaj nespremenjenega: sinhronizira koren z
   `-delete`, njegov filemask pa ne izključuje novih `node_modules/`, `edge/`,
   `scripts/`, `tests/`, `.wrangler/`, `.worker-check/` in `package*.json`.
   Predlog je prenos iz javnega staging paketa brez brisanja nepovezanih poti.
   Skripta v WEB-008 ni popravljena ali zagnana.
5. Potrdi 200 za vseh 74 čistih lokaliziranih URL-jev na izvoru. Če izvor nima
   podpore čistim URL-jem, najprej konfiguriraj natančen interni rewrite
   `/<lang>/<page>` → ustrezna `.html` datoteka; ne dodajaj jezikovnih preusmeritev
   podstranem. Predogled to preslikavo simulira.
6. Nato objavi Worker s pregledano `edge/wrangler.jsonc`; to je ločen korak od
   FTP prenosa. V tej nalogi je izveden samo `--dry-run`, brez objave ali prijave.
7. Ponovi `02-curl.txt` scenarije na javni domeni, vključno z menjavanjem sl/de
   za preverjanje predpomnilnika, vse stare aplikacijske URL-je, `/motd` in
   `/onboarding-motd`. Preveri sitemap in pravilnik. Nato osveži sitemap v orodjih
   iskalnikov, če Matej naroči tudi ta korak.

Povrnitev: ohrani kopijo javnega izvora in prvotnih Cloudflare pravil pred objavo.
Če je treba Worker odstraniti, najprej vrni staro vsebino korena iz potrjene
predhodne objave. Sam umik Workerja ne povrne kanoničnih URL-jev in HTTP-statusov.
Začetni lokalni posnetek v dokazilih ni trditev o vsebini zadnje javne objave.

## Namenoma odprto

- robots.txt ostaja bajtno enak; OD-1 še ni odločena.
- Sveži posnetki 1.8.1 v sl/de/nl/th manjkajo. Ostanejo stare slike; OG uporablja
  lokalizirano besedilo in logotip. Ne predstavljamo jih kot nove posnetke.
- Zunanja potrditev prevodov, če jo pregledovalec želi; besedila so lokalna predaja.
- Živo obnašanje Cloudflare/izvora in objavljena različica aplikacije se potrdita
  pred izrecno naročeno objavo, ne v lokalnem WEB-008.
