# -*- coding: utf-8 -*-
"""Prevodi naslovnice. Kljuc je slovensko besedilo, tako kot stoji v index.html
(presledki in prelomi vrstic so pri iskanju normalizirani)."""

T = {
 # ── navigacija ──────────────────────────────────────────────────────────
 "Preskoči na vsebino": ("Skip to content", "Naar inhoud", "ข้ามไปที่เนื้อหา"),
 "Zakaj": ("Why", "Waarom", "ทำไม"),
 "Kako deluje": ("How it works", "Hoe het werkt", "วิธีใช้งาน"),
 "Funkcije": ("Features", "Functies", "ฟีเจอร์"),
 "Države": ("Countries", "Landen", "ประเทศ"),
 "Cene": ("Pricing", "Prijzen", "ราคา"),
 "Navodila": ("Guide", "Handleiding", "คู่มือ"),
 "Prenesi": ("Download", "Download", "ดาวน์โหลด"),

 # ── hero ────────────────────────────────────────────────────────────────
 "iOS in Android · 47 držav": ("iOS and Android · 47 countries",
                               "iOS en Android · 47 landen",
                               "iOS และ Android · 47 ประเทศ"),
 "Račun izdaš v minuti.": ("An invoice in a minute.", "Een factuur in een minuut.",
                           "ออกใบแจ้งหนี้ในหนึ่งนาที"),
 "Plačilo dobiš z QR kodo.": ("Paid with a QR code.", "Betaald via een QR-code.",
                              "รับเงินด้วย QR code"),
 "Billero je aplikacija za izdajanje računov za samostojne podjetnike, freelancerje "
 "in mala podjetja. Vneseš stranko in znesek, ven pride profesionalen PDF z UPN QR "
 "kodo — pripravljen za stranko in za računovodjo.": (
   "Billero is an invoicing app for freelancers, sole traders and small businesses. "
   "Enter the client and the amount, and out comes a professional PDF with a payment "
   "QR code — ready for your client and for your accountant.",
   "Billero is een factuurapp voor zzp'ers, freelancers en kleine bedrijven. "
   "Je vult de klant en het bedrag in en er rolt een professionele pdf uit met een "
   "betaal-QR-code — klaar voor je klant en voor je boekhouder.",
   "Billero คือแอปออกใบแจ้งหนี้สำหรับฟรีแลนซ์ เจ้าของกิจการคนเดียว และธุรกิจขนาดเล็ก "
   "กรอกชื่อลูกค้าและจำนวนเงิน แล้วรับไฟล์ PDF พร้อม QR code สำหรับชำระเงิน "
   "พร้อมส่งให้ลูกค้าและนักบัญชีของคุณ"),
 "Prenesi na": ("Download on the", "Download in de", "ดาวน์โหลดบน"),
 "Na voljo na": ("Get it on", "Ontdek het op", "ดาวน์โหลดได้ที่"),
 "Brez registracije. Podatki ostanejo na tvoji napravi.": (
   "No sign-up. Your data stays on your device.",
   "Geen registratie. Je gegevens blijven op je toestel.",
   "ไม่ต้องสมัครสมาชิก ข้อมูลอยู่บนเครื่องของคุณ"),

 # ── zakaj ───────────────────────────────────────────────────────────────
 "Zakaj Billero": ("Why Billero", "Waarom Billero", "ทำไมต้อง Billero"),
 "Za en račun ne rabiš računovodskega programa": (
   "You don't need accounting software for one invoice",
   "Voor één factuur heb je geen boekhoudpakket nodig",
   "ออกใบแจ้งหนี้ใบเดียว ไม่ต้องใช้โปรแกรมบัญชี"),
 "Večina orodij za izdajanje računov je narejena za podjetja s knjigovodstvom. "
 "Če izdaš pet računov na mesec, je to strošek, prijava in pol ure učenja za nekaj, "
 "kar bi moralo trajati minuto.": (
   "Most invoicing tools are built for companies with a bookkeeping department. "
   "If you send five invoices a month, that is a subscription, an account and half an "
   "hour of learning for something that should take a minute.",
   "De meeste factuurprogramma's zijn gebouwd voor bedrijven met een boekhoudafdeling. "
   "Stuur je vijf facturen per maand, dan zijn dat kosten, een account en een half uur "
   "leren voor iets dat een minuut zou moeten duren.",
   "โปรแกรมออกใบแจ้งหนี้ส่วนใหญ่ออกแบบมาสำหรับบริษัทที่มีแผนกบัญชี "
   "ถ้าคุณออกใบแจ้งหนี้เดือนละห้าใบ นั่นคือค่าใช้จ่าย บัญชีผู้ใช้ "
   "และเวลาเรียนรู้ครึ่งชั่วโมง สำหรับงานที่ควรใช้เวลาแค่นาทีเดียว"),
 "Word predloga in Excel": ("A Word template and Excel", "Een Word-sjabloon en Excel",
                            "เทมเพลต Word กับ Excel"),
 "Zaporedno številko iščeš v prejšnjem računu": (
   "You look up the next number in the last invoice",
   "Het volgnummer zoek je op in de vorige factuur",
   "ต้องเปิดใบเก่าเพื่อดูเลขที่ถัดไป"),
 "DDV računaš na roko in ga včasih zaokrožiš narobe": (
   "You work out VAT by hand and sometimes round it wrong",
   "Je rekent de btw met de hand uit en rondt soms verkeerd af",
   "คำนวณภาษีเองและบางครั้งปัดเศษผิด"),
 "Stranka mora podatke za plačilo prepisovati": (
   "Your client has to retype the payment details",
   "Je klant moet de betaalgegevens overtypen",
   "ลูกค้าต้องพิมพ์ข้อมูลการชำระเงินเอง"),
 "Ob koncu meseca zbiraš datoteke za računovodjo": (
   "At month end you hunt for files for your accountant",
   "Aan het eind van de maand verzamel je bestanden voor je boekhouder",
   "สิ้นเดือนต้องตามหาไฟล์ให้นักบัญชี"),
 "Kdo ni plačal, veš šele, ko pogledaš izpisek": (
   "You only find out who hasn't paid from your bank statement",
   "Wie niet betaald heeft, zie je pas op je bankafschrift",
   "รู้ว่าใครยังไม่จ่ายก็ต่อเมื่อเปิดดูรายการเดินบัญชี"),
 "Z Billerom": ("With Billero", "Met Billero", "เมื่อใช้ Billero"),
 "Številčenje teče samo, po tvojem vzorcu": (
   "Numbering runs itself, in your own format",
   "De nummering loopt vanzelf door, in jouw eigen opmaak",
   "เลขที่เอกสารเรียงอัตโนมัติตามรูปแบบของคุณ"),
 "DDV se izračuna po pravilih tvoje države": (
   "VAT follows the rules of your country",
   "De btw volgt de regels van jouw land",
   "คำนวณภาษีตามกฎของประเทศคุณ"),
 "UPN QR koda — stranka skenira in plača": (
   "Payment QR code — your client scans and pays",
   "Betaal-QR-code — je klant scant en betaalt",
   "QR code สำหรับชำระเงิน ลูกค้าสแกนแล้วจ่ายได้เลย"),
 "Vse račune pošlješ računovodji z enim dotikom": (
   "Send every invoice to your accountant in one tap",
   "Alle facturen met één tik naar je boekhouder",
   "ส่งใบแจ้งหนี้ทั้งหมดให้นักบัญชีได้ในแตะเดียว"),
 "Zapadli računi so označeni, spomnik gre sam": (
   "Overdue invoices are flagged and the reminder is ready",
   "Achterstallige facturen zijn gemarkeerd, de herinnering staat klaar",
   "ใบที่เลยกำหนดถูกทำเครื่องหมายไว้ พร้อมข้อความแจ้งเตือน"),

 # ── kako deluje ─────────────────────────────────────────────────────────
 "»Kdo mi še ni plačal?« — na prvi pogled": (
   "“Who still hasn't paid?” — at a glance",
   "„Wie heeft nog niet betaald?” — in één oogopslag",
   "“ใครยังไม่จ่าย” — เห็นได้ในพริบตา"),
 "Vsak račun ima svoj status. Zeleno = plačano. Oranžno = rok se izteka. "
 "Rdeče = zapadlo, spomnik gre lahko sam.": (
   "Every invoice has a status. Green = paid. Amber = due soon. "
   "Red = overdue, and the reminder is one tap away.",
   "Elke factuur heeft een status. Groen = betaald. Oranje = bijna vervallen. "
   "Rood = te laat, en de herinnering staat klaar.",
   "ใบแจ้งหนี้ทุกใบมีสถานะ เขียว = จ่ายแล้ว ส้ม = ใกล้ครบกำหนด "
   "แดง = เลยกำหนด และส่งการแจ้งเตือนได้ทันที"),
 "Moji računi": ("My invoices", "Mijn facturen", "ใบแจ้งหนี้ของฉัน"),
 "avgust 2026": ("August 2026", "augustus 2026", "สิงหาคม 2026"),
 "480,00 € · plačano 12. 8. 2026": ("€480.00 · paid 12 Aug 2026",
                                    "€ 480,00 · betaald 12-08-2026",
                                    "€480.00 · จ่ายแล้ว 12 ส.ค. 2026"),
 "plačano": ("paid", "betaald", "จ่ายแล้ว"),
 "1.220,00 € · rok 24. 8. 2026": ("€1,220.00 · due 24 Aug 2026",
                                  "€ 1.220,00 · vervalt 24-08-2026",
                                  "€1,220.00 · ครบกำหนด 24 ส.ค. 2026"),
 "še 3 dni": ("3 days left", "nog 3 dagen", "เหลือ 3 วัน"),
 "640,00 € · zapadlo 2. 8. 2026": ("€640.00 · overdue since 2 Aug 2026",
                                   "€ 640,00 · te laat sinds 02-08-2026",
                                   "€640.00 · เลยกำหนด 2 ส.ค. 2026"),
 "19 dni zamude": ("19 days late", "19 dagen te laat", "ช้า 19 วัน"),
 "Spomnik za zapadle račune pošlji z enim dotikom.": (
   "Send a reminder for overdue invoices in one tap.",
   "Stuur met één tik een herinnering voor achterstallige facturen.",
   "ส่งการแจ้งเตือนใบที่เลยกำหนดได้ในแตะเดียว"),
 "Prikaz vmesnika s primeri podatkov.": (
   "Interface shown with sample data.",
   "Weergave van de interface met voorbeeldgegevens.",
   "ภาพหน้าจอพร้อมข้อมูลตัวอย่าง"),
 "1 · Ustvari": ("1 · Create", "1 · Maken", "1 · สร้าง"),
 "Izbereš stranko, vpišeš storitev in znesek. Številka, datumi in DDV se izpolnijo sami.": (
   "Pick the client, type the service and the amount. Number, dates and VAT fill themselves in.",
   "Kies de klant, vul de dienst en het bedrag in. Nummer, datums en btw vullen zichzelf in.",
   "เลือกลูกค้า กรอกบริการและจำนวนเงิน เลขที่ วันที่ และภาษีถูกกรอกให้อัตโนมัติ"),
 "2 · Pošlji": ("2 · Send", "2 · Versturen", "2 · ส่ง"),
 "PDF gre stranki po e-pošti ali sporočilu. Isti račun z enim dotikom tudi računovodji.": (
   "The PDF goes to your client by email or message. Same invoice to your accountant in one tap.",
   "De pdf gaat per e-mail of bericht naar je klant. Dezelfde factuur met één tik naar je boekhouder.",
   "ส่ง PDF ให้ลูกค้าทางอีเมลหรือข้อความ และส่งใบเดียวกันให้นักบัญชีได้ในแตะเดียว"),
 "3 · Prejmi plačilo": ("3 · Get paid", "3 · Betaald worden", "3 · รับเงิน"),
 "Stranka skenira UPN QR kodo v svoji banki. Nič prepisovanja, nič tipkarskih napak.": (
   "Your client scans the QR code in their banking app. No retyping, no typos.",
   "Je klant scant de QR-code in de bankapp. Niets overtypen, geen typefouten.",
   "ลูกค้าสแกน QR code ในแอปธนาคาร ไม่ต้องพิมพ์ ไม่มีพิมพ์ผิด"),

 # ── funkcije ────────────────────────────────────────────────────────────
 "Kaj vse zna": ("What it does", "Wat het kan", "ทำอะไรได้บ้าง"),
 "Dovolj, da pokriješ celo leto računov": (
   "Enough to cover a full year of invoicing",
   "Genoeg voor een heel jaar factureren",
   "ครบพอสำหรับการออกใบแจ้งหนี้ทั้งปี"),
 "Brez modulov, ki jih ne boš nikoli odprl.": (
   "Without the modules you will never open.",
   "Zonder modules die je nooit opent.",
   "ไม่มีเมนูที่คุณไม่เคยเปิดใช้"),
 "PDF račun z UPN QR": ("PDF invoice with payment QR", "Pdf-factuur met betaal-QR",
                        "ใบแจ้งหนี้ PDF พร้อม QR"),
 "Profesionalen izgled z lastnim logotipom in podpisom. QR koda za takojšnje bančno plačilo.": (
   "A professional look with your own logo and signature. QR code for an instant bank transfer.",
   "Een professionele uitstraling met je eigen logo en handtekening. QR-code voor een directe overboeking.",
   "รูปลักษณ์มืออาชีพพร้อมโลโก้และลายเซ็นของคุณ มี QR code สำหรับโอนเงินทันที"),
 "Samodejni DDV": ("Automatic VAT", "Automatische btw", "คำนวณภาษีอัตโนมัติ"),
 "Stopnje in pravila izdajanja za 47 držav — EU DDV, GST in prodajni davek. "
 "Tudi oproščeni po 94. členu.": (
   "Rates and invoicing rules for 47 countries — EU VAT, GST and sales tax. "
   "Exemptions handled too.",
   "Tarieven en factuurregels voor 47 landen — EU-btw, GST en verkoopsbelasting. "
   "Ook vrijstellingen, zoals de KOR.",
   "อัตราภาษีและกฎการออกใบแจ้งหนี้ของ 47 ประเทศ — VAT ในสหภาพยุโรป GST และภาษีขาย "
   "รวมถึงกรณีได้รับยกเว้นภาษี"),
 "Plačilna povezava": ("Payment link", "Betaallink", "ลิงก์ชำระเงิน"),
 "Stripe, PayPal, Revolut ali Wise QR koda na računu. Stranka skenira in plača s kartico.": (
   "A Stripe, PayPal, Revolut or Wise QR code on the invoice. Your client scans and pays by card.",
   "Een QR-code van Stripe, PayPal, Revolut of Wise op de factuur. Je klant scant en betaalt met kaart.",
   "ใส่ QR code ของ Stripe, PayPal, Revolut หรือ Wise ลงบนใบแจ้งหนี้ ลูกค้าสแกนแล้วจ่ายด้วยบัตร"),
 "Spomniki za neplačnike": ("Reminders for late payers", "Herinneringen voor wanbetalers",
                            "แจ้งเตือนลูกค้าที่ค้างชำระ"),
 "Zapadli računi so označeni, opomin se pripravi sam. Predračun, dobropis in ponavljajoči računi.": (
   "Overdue invoices are flagged and the reminder writes itself. Quotes, credit notes and recurring invoices too.",
   "Achterstallige facturen zijn gemarkeerd en de herinnering schrijft zichzelf. Ook offertes, creditnota's en periodieke facturen.",
   "ใบที่เลยกำหนดถูกทำเครื่องหมายและร่างข้อความแจ้งเตือนให้ พร้อมใบเสนอราคา ใบลดหนี้ และใบแจ้งหนี้แบบเกิดซ้ำ"),
 "Nadzorna plošča": ("Dashboard", "Dashboard", "แดชบอร์ด"),
 "Promet po mesecih, odprte terjatve po starosti, najboljše stranke. Brez izvoza v Excel.": (
   "Revenue by month, receivables by age, your best clients. No export to Excel needed.",
   "Omzet per maand, openstaande posten op ouderdom, je beste klanten. Zonder export naar Excel.",
   "ยอดขายรายเดือน ยอดค้างชำระตามอายุหนี้ และลูกค้าที่ดีที่สุด โดยไม่ต้องส่งออกไป Excel"),
 "ARES in VIES": ("Company lookup and VIES", "Bedrijfsgegevens en VIES", "ค้นหาข้อมูลบริษัทและ VIES"),
 "Vpišeš davčno številko, podatki podjetja se izpolnijo sami. Veljavnost ID za DDV preverjena.": (
   "Type a tax number and the company details fill themselves in. VAT ID validity is checked.",
   "Typ een btw-nummer en de bedrijfsgegevens vullen zichzelf in. De geldigheid van het btw-nummer wordt gecontroleerd.",
   "พิมพ์เลขประจำตัวผู้เสียภาษี แล้วข้อมูลบริษัทจะถูกกรอกให้อัตโนมัติ พร้อมตรวจสอบความถูกต้องของเลข VAT"),

 # ── zaslonske slike ─────────────────────────────────────────────────────
 "Billero v praksi": ("Billero in practice", "Billero in de praktijk", "Billero ในการใช้งานจริง"),
 "Pravi zasloni iz aplikacije": ("Real screens from the app", "Echte schermen uit de app",
                                 "หน้าจอจริงจากแอป"),
 "Podatki podjetja, nov račun z DDV, dodajanje stranke, UPN QR koda in pošiljanje računovodji.": (
   "Company details, a new invoice with VAT, adding a client, the payment QR code and sending to your accountant.",
   "Bedrijfsgegevens, een nieuwe factuur met btw, een klant toevoegen, de betaal-QR-code en versturen naar je boekhouder.",
   "ข้อมูลบริษัท ใบแจ้งหนี้ใหม่พร้อมภาษี การเพิ่มลูกค้า QR code ชำระเงิน และการส่งให้นักบัญชี"),

 # ── drzave ──────────────────────────────────────────────────────────────
 "Lokalizacija": ("Localisation", "Lokalisatie", "การปรับตามท้องถิ่น"),
 "Lokalno skladni računi v 47 državah": (
   "Locally compliant invoices in 47 countries",
   "Lokaal conforme facturen in 47 landen",
   "ใบแจ้งหนี้ที่สอดคล้องกับกฎท้องถิ่นใน 47 ประเทศ"),
 "Davčne stopnje, obvezni podatki na računu in oblika številčenja se prilagodijo državi, "
 "ki jo izbereš ob prvem zagonu.": (
   "Tax rates, the fields an invoice must carry and the numbering format all follow the "
   "country you pick on first launch.",
   "Belastingtarieven, de verplichte factuurgegevens en de nummering volgen het land dat "
   "je bij de eerste start kiest.",
   "อัตราภาษี ข้อมูลที่ต้องมีบนใบแจ้งหนี้ และรูปแบบเลขที่เอกสาร "
   "จะปรับตามประเทศที่คุณเลือกเมื่อเปิดแอปครั้งแรก"),
 "Podprte države": ("Supported countries", "Ondersteunde landen", "ประเทศที่รองรับ"),
 "Ustavi se na državi za davčno stopnjo.": (
   "Hover a country to see its tax rate.",
   "Beweeg over een land voor het belastingtarief.",
   "วางเมาส์บนประเทศเพื่อดูอัตราภาษี"),

 # ── zasebnost ───────────────────────────────────────────────────────────
 "Zasebnost": ("Privacy", "Privacy", "ความเป็นส่วนตัว"),
 "Tvoje stranke ostanejo tvoje": ("Your clients stay yours", "Jouw klanten blijven van jou",
                                  "ลูกค้าของคุณยังเป็นของคุณ"),
 "Billero nima uporabniških računov, ker jih ne potrebuje. Podatki so v bazi na tvoji napravi.": (
   "Billero has no user accounts because it doesn't need them. Your data lives in a database on your device.",
   "Billero heeft geen gebruikersaccounts, omdat het die niet nodig heeft. Je gegevens staan in een database op je toestel.",
   "Billero ไม่มีระบบบัญชีผู้ใช้เพราะไม่จำเป็นต้องมี ข้อมูลของคุณเก็บอยู่ในฐานข้อมูลบนเครื่องของคุณ"),
 "Brez registracije in brez prijave": ("No sign-up and no login", "Geen registratie en geen login",
                                       "ไม่ต้องสมัครและไม่ต้องเข้าสู่ระบบ"),
 "Baza strank in računov ostane na napravi": (
   "Clients and invoices stay on the device",
   "Klanten en facturen blijven op het toestel",
   "ข้อมูลลูกค้าและใบแจ้งหนี้อยู่บนเครื่อง"),
 "Varnostna kopija šifrirana z AES-256": ("Backups encrypted with AES-256",
                                          "Back-ups versleuteld met AES-256",
                                          "สำรองข้อมูลเข้ารหัสด้วย AES-256"),
 "API ključi privzeto niso v varnostni kopiji": (
   "API keys are excluded from backups by default",
   "API-sleutels staan standaard niet in de back-up",
   "คีย์ API ไม่ถูกรวมในไฟล์สำรองโดยค่าเริ่มต้น"),
 "Deluje brez internetne povezave": ("Works without an internet connection",
                                     "Werkt zonder internetverbinding",
                                     "ใช้งานได้โดยไม่ต้องต่ออินเทอร์เน็ต"),
 "Izvoz vseh podatkov, kadar hočeš": ("Export all your data whenever you want",
                                      "Exporteer al je gegevens wanneer je wilt",
                                      "ส่งออกข้อมูลทั้งหมดได้ทุกเมื่อ"),

 # ── cene ────────────────────────────────────────────────────────────────
 "Začni brezplačno, plačaj šele, ko ti zmanjka računov": (
   "Start free, pay only when you run out of invoices",
   "Begin gratis, betaal pas als je facturen opraken",
   "เริ่มใช้ฟรี จ่ายเมื่อใบแจ้งหนี้ไม่พอ"),
 "En pravočasno plačan račun povrne celoletno naročnino.": (
   "One invoice paid on time covers a whole year of the subscription.",
   "Eén factuur die op tijd betaald wordt, dekt een heel jaar abonnement.",
   "ใบแจ้งหนี้ที่ได้รับชำระตรงเวลาเพียงใบเดียว ก็คุ้มค่าสมาชิกทั้งปี"),
 "Brezplačno": ("Free", "Gratis", "ฟรี"),
 "za začetek": ("to get started", "om te beginnen", "สำหรับเริ่มต้น"),
 "10 računov na leto": ("10 invoices a year", "10 facturen per jaar", "ใบแจ้งหนี้ 10 ใบต่อปี"),
 "PDF z UPN QR kodo": ("PDF with a payment QR code", "Pdf met betaal-QR-code",
                       "PDF พร้อม QR code ชำระเงิน"),
 "Oznaka »Created with Billero«": ("“Created with Billero” mark",
                                   "Vermelding „Created with Billero”",
                                   "มีข้อความ “Created with Billero”"),
 "Najbolj priljubljeno": ("Most popular", "Populairste", "ยอดนิยม"),
 "/mesec": ("/month", "/maand", "/เดือน"),
 "ali 29 € na leto": ("or €29 a year", "of € 29 per jaar", "หรือ €29 ต่อปี"),
 "Neomejeno računov, brez oznake": ("Unlimited invoices, no mark",
                                    "Onbeperkt facturen, zonder vermelding",
                                    "ใบแจ้งหนี้ไม่จำกัด ไม่มีข้อความกำกับ"),
 "ARES in VIES samodejno izpolnjevanje": ("Company lookup and VIES autofill",
                                          "Automatisch invullen via bedrijfsgegevens en VIES",
                                          "กรอกข้อมูลบริษัทและ VIES อัตโนมัติ"),
 "Ponavljajoči računi in popusti": ("Recurring invoices and discounts",
                                    "Periodieke facturen en kortingen",
                                    "ใบแจ้งหนี้แบบเกิดซ้ำและส่วนลด"),
 "Večjezični PDF, samodejna varnostna kopija": ("Multi-language PDF, automatic backup",
                                                "Meertalige pdf, automatische back-up",
                                                "PDF หลายภาษา และสำรองข้อมูลอัตโนมัติ"),
 "ali 59 € na leto": ("or €59 a year", "of € 59 per jaar", "หรือ €59 ต่อปี"),
 "Vse iz Plus": ("Everything in Plus", "Alles uit Plus", "ทุกอย่างในแพ็กเกจ Plus"),
 "Predračun in dobropis": ("Quotes and credit notes", "Offertes en creditnota's",
                           "ใบเสนอราคาและใบลดหนี้"),
 "Samodejni spomniki za neplačnike": ("Automatic reminders for late payers",
                                      "Automatische herinneringen voor wanbetalers",
                                      "แจ้งเตือนลูกค้าค้างชำระอัตโนมัติ"),
 "Nadzorna plošča in neomejeno OCR branje": ("Dashboard and unlimited OCR scanning",
                                             "Dashboard en onbeperkt OCR-scannen",
                                             "แดชบอร์ดและสแกน OCR ไม่จำกัด"),
 "Naročnina se obnavlja samodejno, prekličeš jo v App Store ali Google Play. "
 "Končno ceno v tvoji valuti določi trgovina.": (
   "The subscription renews automatically; cancel it in the App Store or Google Play. "
   "The final price in your currency is set by the store.",
   "Het abonnement wordt automatisch verlengd; opzeggen doe je in de App Store of Google Play. "
   "De uiteindelijke prijs in jouw valuta wordt door de store bepaald.",
   "ระบบต่ออายุสมาชิกอัตโนมัติ ยกเลิกได้ใน App Store หรือ Google Play "
   "ราคาสุดท้ายในสกุลเงินของคุณกำหนดโดยร้านค้าแอป"),

 # ── FAQ ─────────────────────────────────────────────────────────────────
 "Pogosta vprašanja": ("Questions", "Veelgestelde vragen", "คำถามที่พบบ่อย"),
 "Vse, kar te zanima": ("Everything you might ask", "Alles wat je wilt weten",
                        "ทุกเรื่องที่คุณอยากรู้"),
 "Ali rabim uporabniški račun?": ("Do I need an account?", "Heb ik een account nodig?",
                                  "ต้องมีบัญชีผู้ใช้ไหม"),
 "Ne. Ni registracije in ni prijave. Podatki o strankah in računih so shranjeni lokalno na tvoji napravi.": (
   "No. There is no sign-up and no login. Client and invoice data is stored locally on your device.",
   "Nee. Er is geen registratie en geen login. Klant- en factuurgegevens staan lokaal op je toestel.",
   "ไม่ต้อง ไม่มีการสมัครและไม่มีการเข้าสู่ระบบ ข้อมูลลูกค้าและใบแจ้งหนี้เก็บไว้บนเครื่องของคุณ"),
 "Ali je Billero primeren za s.p. in d.o.o.?": (
   "Is Billero suitable for sole traders and limited companies?",
   "Is Billero geschikt voor zzp'ers en bv's?",
   "Billero เหมาะกับเจ้าของกิจการคนเดียวและบริษัทจำกัดไหม"),
 "Da. Podpira zavezance za DDV in tiste, ki niso, oprostitve po 94. členu ZDDV-1, "
 "več plačilnih računov in lastno oštevilčenje. Za polno knjigovodstvo ostaja tvoj računovodja.": (
   "Yes. It supports VAT-registered and non-registered businesses, exemption clauses, "
   "several bank accounts and your own numbering. Full bookkeeping stays with your accountant.",
   "Ja. Het ondersteunt btw-plichtige en niet-btw-plichtige ondernemers, vrijstellingsclausules, "
   "meerdere rekeningen en je eigen nummering. Volledige boekhouding blijft bij je boekhouder.",
   "ใช่ รองรับทั้งผู้จดทะเบียนภาษีมูลค่าเพิ่มและไม่จดทะเบียน ข้อความยกเว้นภาษี "
   "บัญชีธนาคารหลายบัญชี และรูปแบบเลขที่ของคุณเอง ส่วนงานบัญชีเต็มรูปแบบยังเป็นหน้าที่ของนักบัญชี"),
 "Kaj je UPN QR koda in ali jo banke sprejmejo?": (
   "What is the payment QR code and do banks accept it?",
   "Wat is de betaal-QR-code en accepteren banken die?",
   "QR code ชำระเงินคืออะไร ธนาคารรองรับหรือไม่"),
 "To je standardna slovenska koda za plačilni nalog. Stranka jo skenira v svoji mobilni banki "
 "in vsi podatki za plačilo se izpolnijo sami. V drugih državah Billero uporabi lokalno "
 "ustaljeno obliko oziroma plačilno povezavo.": (
   "It is the standard code for a payment order. Your client scans it in their banking app and "
   "every payment field fills itself in. In other countries Billero uses the local standard or "
   "a payment link instead.",
   "Het is de standaardcode voor een betaalopdracht. Je klant scant hem in de bankapp en alle "
   "betaalvelden vullen zichzelf in. In andere landen gebruikt Billero de lokale standaard of "
   "een betaallink.",
   "เป็นรหัสมาตรฐานสำหรับคำสั่งชำระเงิน ลูกค้าสแกนในแอปธนาคารแล้วข้อมูลการชำระเงินจะถูกกรอกให้อัตโนมัติ "
   "ในประเทศอื่น Billero จะใช้มาตรฐานท้องถิ่นหรือลิงก์ชำระเงินแทน"),
 "Kako pošljem račune računovodji?": ("How do I send invoices to my accountant?",
                                      "Hoe stuur ik facturen naar mijn boekhouder?",
                                      "ส่งใบแจ้งหนี้ให้นักบัญชีอย่างไร"),
 "V seznamu računov izbereš obdobje in vse pošlješ v enem sporočilu — PDF-ji in zbirna datoteka skupaj.": (
   "In the invoice list you pick a period and send everything in one message — the PDFs and a summary file together.",
   "In de factuurlijst kies je een periode en verstuur je alles in één bericht — de pdf's en een overzichtsbestand samen.",
   "ในรายการใบแจ้งหนี้ ให้เลือกช่วงเวลาแล้วส่งทั้งหมดในข้อความเดียว ทั้งไฟล์ PDF และไฟล์สรุป"),
 "Kaj se zgodi, če zamenjam telefon?": ("What happens if I change phones?",
                                        "Wat gebeurt er als ik van telefoon wissel?",
                                        "ถ้าเปลี่ยนโทรศัพท์จะเป็นอย่างไร"),
 "Narediš varnostno kopijo, ki jo lahko zaščitiš z geslom (AES-256), in jo na novi napravi obnoviš. "
 "Vključeni so logotip, podpis in prejeti računi.": (
   "You make a backup, optionally protected with a password (AES-256), and restore it on the new device. "
   "Your logo, signature and received invoices are included.",
   "Je maakt een back-up, eventueel beveiligd met een wachtwoord (AES-256), en zet die terug op het nieuwe toestel. "
   "Je logo, handtekening en ontvangen facturen zitten erbij.",
   "คุณสร้างไฟล์สำรองข้อมูล ซึ่งตั้งรหัสผ่านได้ (AES-256) แล้วกู้คืนบนเครื่องใหม่ "
   "โดยรวมโลโก้ ลายเซ็น และใบแจ้งหนี้ที่ได้รับไว้ด้วย"),
 "Deluje brez interneta?": ("Does it work offline?", "Werkt het offline?",
                            "ใช้งานออฟไลน์ได้ไหม"),
 "Da. Za izdajanje računov povezave ne potrebuješ. Internet rabijo samo ARES in VIES poizvedbe, "
 "AI branje računov in pošiljanje.": (
   "Yes. You don't need a connection to create invoices. Only company lookups, VIES checks, "
   "AI receipt scanning and sending need the internet.",
   "Ja. Voor het maken van facturen heb je geen verbinding nodig. Alleen bedrijfsgegevens opzoeken, "
   "VIES-controles, AI-bonnen scannen en versturen hebben internet nodig.",
   "ได้ การออกใบแจ้งหนี้ไม่ต้องใช้อินเทอร์เน็ต จะใช้เน็ตเฉพาะตอนค้นหาข้อมูลบริษัท ตรวจสอบ VIES "
   "สแกนใบเสร็จด้วย AI และการส่งเอกสาร"),

 # ── zakljucni poziv ─────────────────────────────────────────────────────
 "Naslednji račun izdaj v minuti": ("Make your next invoice in a minute",
                                    "Maak je volgende factuur in een minuut",
                                    "ออกใบแจ้งหนี้ใบถัดไปในหนึ่งนาที"),
 "Prenesi Billero in ga preizkusi na pravem računu. Brez registracije, brez kartice.": (
   "Download Billero and try it on a real invoice. No sign-up, no card.",
   "Download Billero en probeer het op een echte factuur. Geen registratie, geen creditcard.",
   "ดาวน์โหลด Billero แล้วลองใช้กับใบแจ้งหนี้จริง ไม่ต้องสมัคร ไม่ต้องใช้บัตร"),
 "Vprašanje pred prenosom?": ("A question before you download?",
                              "Nog een vraag voordat je downloadt?",
                              "มีคำถามก่อนดาวน์โหลดไหม"),
 "Piši nam": ("Write to us", "Stuur ons een bericht", "ติดต่อเรา"),

 # ── noga ────────────────────────────────────────────────────────────────
 "· računi za samostojne podjetnike": ("· invoicing for the self-employed",
                                       "· factureren voor zelfstandigen",
                                       "· ระบบออกใบแจ้งหนี้สำหรับผู้ประกอบอาชีพอิสระ"),
 "Novosti": ("Release notes", "Wat is er nieuw", "สิ่งที่อัปเดต"),
 "Pogoji uporabe": ("Terms of use", "Gebruiksvoorwaarden", "เงื่อนไขการใช้งาน"),
 "Pravne informacije": ("Legal information", "Juridische informatie", "ข้อมูลทางกฎหมาย"),
 "Kontakt": ("Contact", "Contact", "ติดต่อ"),
 "Podpri nas": ("Support us", "Steun ons", "สนับสนุนเรา"),
}

# Atributi in meta oznake (natancno ujemanje, brez normalizacije presledkov)
ATTRS = {
 "Billero — račun izdaš v minuti, plačilo dobiš z QR kodo": (
   "Billero — an invoice in a minute, paid with a QR code",
   "Billero — een factuur in een minuut, betaald via een QR-code",
   "Billero — ออกใบแจ้งหนี้ในหนึ่งนาที รับเงินด้วย QR code"),
 "Preprosta aplikacija za izdajanje računov za samostojne podjetnike in mala podjetja. "
 "PDF račun z UPN QR kodo, samodejni DDV, pošiljanje računovodji. 47 držav, brez registracije.": (
   "A simple invoicing app for freelancers, sole traders and small businesses. PDF invoices with "
   "a payment QR code, automatic VAT, one-tap sending to your accountant. 47 countries, no sign-up.",
   "Een eenvoudige factuurapp voor zzp'ers en kleine bedrijven. Pdf-facturen met betaal-QR-code, "
   "automatische btw, met één tik naar je boekhouder. 47 landen, geen registratie.",
   "แอปออกใบแจ้งหนี้ที่ใช้ง่ายสำหรับฟรีแลนซ์และธุรกิจขนาดเล็ก ใบแจ้งหนี้ PDF พร้อม QR code ชำระเงิน "
   "คำนวณภาษีอัตโนมัติ ส่งให้นักบัญชีได้ในแตะเดียว รองรับ 47 ประเทศ ไม่ต้องสมัครสมาชิก"),
 "Preprosta aplikacija za izdajanje računov. PDF z UPN QR kodo, samodejni DDV, "
 "pošiljanje računovodji. Brez registracije.": (
   "A simple invoicing app. PDF with a payment QR code, automatic VAT, one-tap sending to your "
   "accountant. No sign-up.",
   "Een eenvoudige factuurapp. Pdf met betaal-QR-code, automatische btw, met één tik naar je "
   "boekhouder. Geen registratie.",
   "แอปออกใบแจ้งหนี้ที่ใช้ง่าย ใบแจ้งหนี้ PDF พร้อม QR code ชำระเงิน คำนวณภาษีอัตโนมัติ "
   "ส่งให้นักบัญชีได้ในแตะเดียว ไม่ต้องสมัครสมาชิก"),
 "Preprosta aplikacija za izdajanje računov. PDF z UPN QR kodo, samodejni DDV, pošiljanje računovodji.": (
   "A simple invoicing app. PDF with a payment QR code, automatic VAT, sending to your accountant.",
   "Een eenvoudige factuurapp. Pdf met betaal-QR-code, automatische btw, versturen naar je boekhouder.",
   "แอปออกใบแจ้งหนี้ที่ใช้ง่าย ใบแจ้งหนี้ PDF พร้อม QR code ชำระเงิน คำนวณภาษีอัตโนมัติ ส่งให้นักบัญชี"),
 "Billero — račune izdaš v minuti": ("Billero — invoices in a minute",
                                     "Billero — facturen in een minuut",
                                     "Billero — ออกใบแจ้งหนี้ในหนึ่งนาที"),
 "Billero — podatki podjetja": ("Billero — company details", "Billero — bedrijfsgegevens",
                                "Billero — ข้อมูลบริษัท"),
 "Billero — nov račun z obračunanim DDV": ("Billero — a new invoice with VAT calculated",
                                           "Billero — een nieuwe factuur met berekende btw",
                                           "Billero — ใบแจ้งหนี้ใหม่พร้อมภาษีที่คำนวณแล้ว"),
 "Billero — dodajanje stranke": ("Billero — adding a client", "Billero — een klant toevoegen",
                                 "Billero — การเพิ่มลูกค้า"),
 "Billero — UPN QR koda za plačilo": ("Billero — payment QR code", "Billero — betaal-QR-code",
                                      "Billero — QR code สำหรับชำระเงิน"),
 "Billero — pošiljanje računov računovodji": ("Billero — sending invoices to your accountant",
                                              "Billero — facturen naar je boekhouder sturen",
                                              "Billero — การส่งใบแจ้งหนี้ให้นักบัญชี"),
 # JSON-LD
 "Aplikacija za izdajanje računov za samostojne podjetnike in mala podjetja. "
 "PDF račun z UPN QR kodo, samodejni obračun DDV, pošiljanje računovodji.": (
   "An invoicing app for freelancers, sole traders and small businesses. PDF invoices with a "
   "payment QR code, automatic VAT, sending to your accountant.",
   "Een factuurapp voor zzp'ers en kleine bedrijven. Pdf-facturen met betaal-QR-code, "
   "automatische btw, versturen naar je boekhouder.",
   "แอปออกใบแจ้งหนี้สำหรับฟรีแลนซ์และธุรกิจขนาดเล็ก ใบแจ้งหนี้ PDF พร้อม QR code ชำระเงิน "
   "คำนวณภาษีอัตโนมัติ และส่งให้นักบัญชี"),
 # skrajsani odgovori v JSON-LD (ne ujemajo se doslovno z besedilom na strani)
 "Da. Podpira zavezance za DDV in tiste, ki niso, oprostitve po 94. členu ZDDV-1, "
 "več plačilnih računov in lastno oštevilčenje.": (
   "Yes. It supports VAT-registered and non-registered businesses, exemption clauses, "
   "several bank accounts and your own numbering.",
   "Ja. Het ondersteunt btw-plichtige en niet-btw-plichtige ondernemers, vrijstellingsclausules, "
   "meerdere rekeningen en je eigen nummering.",
   "ใช่ รองรับทั้งผู้จดทะเบียนภาษีมูลค่าเพิ่มและไม่จดทะเบียน ข้อความยกเว้นภาษี "
   "บัญชีธนาคารหลายบัญชี และรูปแบบเลขที่ของคุณเอง"),
 "To je standardna slovenska koda za plačilni nalog. Stranka jo skenira v mobilni banki "
 "in podatki za plačilo se izpolnijo sami.": (
   "It is the standard code for a payment order. Your client scans it in their banking app and "
   "the payment fields fill themselves in.",
   "Het is de standaardcode voor een betaalopdracht. Je klant scant hem in de bankapp en de "
   "betaalvelden vullen zichzelf in.",
   "เป็นรหัสมาตรฐานสำหรับคำสั่งชำระเงิน ลูกค้าสแกนในแอปธนาคารแล้วข้อมูลการชำระเงินจะถูกกรอกให้อัตโนมัติ"),
 "Narediš varnostno kopijo, ki jo lahko zaščitiš z geslom (AES-256), in jo na novi napravi obnoviš.": (
   "You make a backup, optionally protected with a password (AES-256), and restore it on the new device.",
   "Je maakt een back-up, eventueel beveiligd met een wachtwoord (AES-256), en zet die terug op het nieuwe toestel.",
   "คุณสร้างไฟล์สำรองข้อมูล ซึ่งตั้งรหัสผ่านได้ (AES-256) แล้วกู้คืนบนเครื่องใหม่"),
}
LEGEND = {
  'en': ('Supported countries', 'Hover a country to see its tax rate.'),
  'nl': ('Ondersteunde landen', 'Beweeg over een land voor het belastingtarief.'),
  'th': ('ประเทศที่รองรับ', 'วางเมาส์บนประเทศเพื่อดูอัตราภาษี'),
}

LOCALE = {'en': 'en_GB', 'nl': 'nl_NL', 'th': 'th_TH'}
