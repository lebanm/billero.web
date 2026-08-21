# Billero — Facebook stran (paket za postavitev)

Interni dokument. Mapa `ai/` je izključena iz FTP objave (`deploy_web.bat`), zato to ne pride na splet.

Vse besedilo spodaj je pripravljeno za kopiranje. Slike so v repozitoriju:

| Kaj | Datoteka | Velikost |
|---|---|---|
| Profilna slika | `img/social/fb_profile_1080.png` | 1080 × 1080 |
| Naslovna slika | `img/social/fb_cover_1640x856.png` | 1640 × 856 |
| Slika ob deljenju povezave | `img/billero_og.png` | 1200 × 630 |

Naslovna slika ima vso vsebino v sredini, ker Facebook na namizju in na telefonu reže
drugače (namizje ~820 × 312, telefon ~640 × 360). Profilna je zamaknjena navznoter, ker
jo Facebook obreže v krog.

---

## 1. Nastavitve strani

| Polje | Vrednost |
|---|---|
| Ime strani | `Billero` |
| Uporabniško ime | `@billeroapp` (če je zasedeno: `@billero.app`) |
| Kategorija | Programska oprema (Software) → dodatno: Poslovna storitev |
| Gumb s pozivom | **Prenesi aplikacijo** → `https://billero.app/` |
| Spletna stran | `https://billero.app/` |
| E-pošta | `info@billero.app` |
| Jezik strani | slovenščina (dodaj angleščino kot drugi jezik) |
| Država | Slovenija |

Povezave, ki jih dodaj v razdelek »Več informacij«:

- App Store — https://apps.apple.com/si/app/billero/id6760204857
- Google Play — https://play.google.com/store/apps/details?id=com.billero.app
- Navodila — https://billero.app/user-guide.html
- Zasebnost — https://billero.app/privacy-policy.html
- Pogoji uporabe — https://billero.app/terms-of-use.html

---

## 2. Opisi

**Kratek opis (do 255 znakov, polje »Bio«)**

```
Aplikacija za izdajanje računov za s.p. in mala podjetja. Račun narediš v minuti,
PDF z UPN QR kodo pošlješ stranki ali računovodji. Brez registracije. iOS in Android.
```

**Daljši opis (razdelek »O nas«)**

```
Billero je preprosta aplikacija za izdajanje računov — za samostojne podjetnike,
freelancerje, inštruktorje, terapevte, obrtnike in mala podjetja.

Vneseš stranko, storitev in znesek. Billero poskrbi za zaporedno številko, datume in
obračun DDV, ven pa pride profesionalen PDF račun z UPN QR kodo. Stranka kodo skenira
v svoji mobilni banki in plača brez prepisovanja podatkov.

• PDF račun z lastnim logotipom in podpisom
• Samodejni obračun DDV, tudi oprostitev po 94. členu
• UPN QR koda ter povezave Stripe, PayPal, Revolut in Wise
• Predračun, dobropis in ponavljajoči računi
• Vsi računi za obdobje računovodji z enim dotikom
• Samodejno izpolnjevanje podatkov iz ARES in VIES
• Deluje brez registracije — podatki ostanejo na tvoji napravi
• Lokalno skladni računi v 47 državah

Prenesi: billero.app
Vprašanja: info@billero.app
```

---

## 3. Pripeta objava

Objavi jo in pripni na vrh strani. Priloži `img/billero_og.png`.

```
Račun izdaš v minuti. Plačilo dobiš z QR kodo. 🧾

Billero je aplikacija za izdajanje računov za s.p. in mala podjetja. Brez registracije,
brez računovodskega programa, brez učenja.

1. Vneseš stranko, storitev in znesek
2. Billero naredi PDF z UPN QR kodo
3. Stranka skenira in plača

Pošiljanje računovodji je en dotik — vsi računi za obdobje v enem sporočilu.

📲 billero.app
```

---

## 4. Prvih deset objav

Ritem: dve objavi na teden, torek in četrtek dopoldne. Vsaka objava ima eno misel in en
poziv. Emojije uporabljaj skopo — po enega na odstavek, ne več.

**1 — Predstavitev (slika: `img/billero_og.png`)**
```
Zdravo. Billero je aplikacija za izdajanje računov, narejena za tiste, ki izdajo pet
računov na mesec in ne potrebujejo računovodskega programa za 30 € mesečno.

Vneseš stranko in znesek, ven pride PDF z UPN QR kodo. To je vse.

billero.app
```

**2 — Ena funkcija: UPN QR (slika: `img/screenshots/qr.png`)**
```
Zakaj UPN QR koda na računu?

Ker stranka ne prepisuje IBAN-a, sklica in zneska. Odpre mobilno banko, skenira kodo,
potrdi. Manj tipkarskih napak pomeni manj reklamacij in hitrejše plačilo.

Koda je na vsakem računu, ki ga izdaš z Billerom.
```

**3 — Problem, ki ga poznajo vsi**
```
Konec meseca. Računovodkinja piše: »Pošlji mi račune.«

Ti pa brskaš po e-pošti, mapi Prenosi in enem Wordovem dokumentu, ki se imenuje
racun-koncni-KONCNI2.docx.

V Billeru izbereš obdobje in pošlješ vse naenkrat.
```

**4 — DDV (slika: `img/screenshots/nov_racun_ddv.png`)**
```
DDV se obračuna sam — po stopnjah in pravilih države, ki jo izbereš ob prvem zagonu.

Nisi zavezanec? Billero na račun zapiše ustrezno klavzulo o oprostitvi po 94. členu
ZDDV-1, da ti je ni treba iskati vsakič znova.
```

**5 — Za koga je**
```
Kdo uporablja Billero:

• inštruktorji joge, plavanja, glasbe
• osebni trenerji in terapevti
• svetovalci in freelancerji
• obrtniki in servisi
• mala podjetja brez svojega računovodstva

Skupno jim je eno: račun mora biti narejen zdaj, ne v ponedeljek.
```

**6 — Zasebnost**
```
Billero nima uporabniških računov, ker jih ne potrebuje.

Podatki o strankah in računih ostanejo v bazi na tvojem telefonu. Varnostno kopijo lahko
zaščitiš z geslom (AES-256). Nič ne gre v oblak, ker oblaka ni.
```

**7 — Novosti (posodobi ob vsaki izdaji)**
```
Novo v zadnji različici:

• zanesljivejši nakup in obnova naročnine
• varnostna kopija zdaj vključuje tudi prejete račune
• paketi in opisi prevedeni v vse jezike vmesnika

Vse novosti: billero.app/release-notes.html
```

**8 — Neplačniki**
```
Najbolj neprijeten del samostojnega dela ni delo. Je vprašanje »kdaj bo plačano«.

V Billeru so zapadli računi označeni, opomnik pa pripravljen — pošlješ ga z enim
dotikom, brez pisanja neprijetnega sporočila od začetka.
```

**9 — Vprašanje skupnosti (za komentarje)**
```
Zanima nas: koliko časa ti vzame en račun od začetka do poslano?

Napiši v komentar. Iščemo korake, ki jih lahko odpravimo.
```

**10 — Družbeni dokaz (objavi, ko imaš oceno ali odziv uporabnika)**
```
Prva ocena v trgovini. Hvala. 🙏

Če Billero uporabljaš in ti prihrani čas, nam res pomaga, če pustiš oceno — od tega je
odvisno, ali te aplikacijo sploh najde nekdo, ki jo potrebuje.
```

---

## 5. Kje objavljati poleg strani

Facebook skupine, kjer je občinstvo (najprej preberi pravila skupine, večina prepoveduje
neposredno oglaševanje — objavi kot odgovor na vprašanje, ne kot oglas):

- Samostojni podjetniki Slovenije / s.p. skupine
- Freelancerji Slovenija
- Skupine za mala podjetja in obrtnike
- Skupine posameznih poklicev (fitnes trenerji, kozmetika, mizarstvo)

Pravilo: če nekdo vpraša »s čim izdajate račune«, odgovori z opisom in povezavo. Če
nihče ne vpraša, ne objavljaj oglasa.

---

## 6. Odgovori na pogosta vprašanja v komentarjih

**»Koliko stane?«**
```
Brezplačna različica pokrije 10 računov na leto. Plus je 3,99 €/mesec (29 €/leto),
Pro 7,99 €/mesec (59 €/leto). Vse cene in razlike so na billero.app.
```

**»Je to za s.p. ali d.o.o.?«**
```
Oboje. Podpira zavezance za DDV in tiste, ki niso, več plačilnih računov in lastno
oštevilčenje. Za polno knjigovodstvo ostane tvoj računovodja — Billero pokriva
izdajanje računov.
```

**»Kje so moji podatki?«**
```
Na tvoji napravi, v lokalni bazi. Ni registracije in ni strežnika s tvojimi strankami.
Varnostno kopijo narediš sam in jo lahko zaščitiš z geslom.
```

**»Deluje na iPhonu in Androidu?«**
```
Da, na obeh. Povezavi do trgovin sta v razdelku »O nas« na naši strani.
```

---

## 7. Na kaj paziti

- Ne obljubljaj davčne ali pravne skladnosti kot zagotovila. Piši »lokalno skladne
  davčne stopnje«, ne »zagotavljamo skladnost z zakonodajo«.
- Ne objavljaj zaslonskih slik s pravimi podatki strank.
- Ocene v trgovinah lahko prosiš, ne smeš pa jih plačati ali menjati za popust —
  Apple in Google to prepovedujeta.
- Ko prvič deliš `billero.app`, poženi povezavo skozi Facebook Sharing Debugger
  (`developers.facebook.com/tools/debug/`) in klikni »Scrape Again«, da si Facebook
  potegne novo sliko `billero_og.png` namesto stare ikone.

---

## 8. Kaj še manjka

- [ ] Ustvariti stran in rezervirati uporabniško ime, preden ga vzame kdo drug.
- [ ] Zaslonske slike v repozitoriju so iz starejše različice aplikacije (svetla tema z
      zeleno) in se ne ujemajo z današnjim videzom. Za objave in za naslovnico bi bilo
      dobro posneti nove.
- [ ] Instagram račun z istim uporabniškim imenom in povezati z Meta Business Suite,
      da objavljaš na obe platformi hkrati.
