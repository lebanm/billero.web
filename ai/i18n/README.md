# Prevodi naslovnice

Slovenska `index.html` je edini vir resnice za zgradbo strani. Datoteke
`en/index.html`, `nl/index.html` in `th/index.html` so **generirane** — ne
urejaj jih neposredno, ker jih naslednji zagon skripte povozi.

## Postopek

1. Spremeni `index.html` (SL).
2. Če si dodal ali spremenil besedilo, dopolni `strings.py`. Ključ je slovensko
   besedilo tako, kot stoji v HTML; vrednost je trojica `(EN, NL, TH)`.
3. Poženi:

   ```bash
   python3 ai/i18n/gen_langs.py          # vsi trije jeziki
   python3 ai/i18n/gen_langs.py en       # samo eden
   ```

Skripta izpiše opozorilo, če v generirani strani ostane slovensko besedilo
(išče šumnike), kar pomeni, da kakšen ključ manjka v `strings.py`.

## Kaj skripta naredi poleg zamenjave besedila

- nastavi `lang`, `canonical`, `og:url` in `og:locale`
- prestavi oznako trenutnega jezika v preklopniku
- popravi poti do slik (podstran je eno mapo globlje) in povezavo na
  `release-notes-<jezik>.html`
- zamenja povezavo do App Store s tisto brez oznake države, da nizozemski
  obiskovalec ne pristane v slovenski trgovini
- vstavi seznam držav iz `countries.json` v jeziku strani

## countries.json

47 držav, za vsako `[ime države, davčna oznaka]` v štirih jezikih. Seznam je
usklajen s `country_legal_data.dart` v aplikaciji. Če v aplikaciji dodaš državo,
jo dodaj tudi tu, sicer je na zemljevidu ne bo.

## Kaj skripta ne prevede

Komentarji v CSS in JavaScriptu ostanejo slovenski — so razvojne opombe, ne
vsebina strani.
