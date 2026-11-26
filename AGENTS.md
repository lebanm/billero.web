# Pravila za agente — Billero splet

Ta pravila veljajo za repozitorij `C:\Users\matej\git\billero.web`.
Aplikacija je v `C:\Users\matej\git\billero.app`, edini skupni vir naloge in
sporočil pa v `C:\Users\matej\git\billero.app\docs\ai`.

## Kaj prebrati pred delom

Pred vsako spremembo v celoti preberi:

1. ta `AGENTS.md`;
2. `ai/context.md` in `ai/coding_rules.md`;
3. `C:\Users\matej\git\billero.app\docs\ai\current-task.md`;
4. `C:\Users\matej\git\billero.app\docs\ai\PRODUCT-CONTRACT.md`;
5. najnovejše sporočilo v predalu, namenjenem tvojemu agentu.

Če naloga posega v aplikacijo, preberi tudi
`C:\Users\matej\git\billero.app\AGENTS.md`, `ai/context.md` in
`ai/coding_rules.md` v aplikacijskem repozitoriju.

## Lastništvo in obseg

- Codex je privzeti primarni lastnik spleta, marketinškega besedila,
  dokumentacije in skladnosti trditev z aplikacijo.
- Claude je privzeti primarni lastnik aplikacije in presoja, kaj trenutna koda
  ter izdaja dejansko podpirata.
- Aktivna naloga lahko vlogi spremeni.
- Spreminjaj samo poti, navedene v `current-task.md`. Pregledovalec ne
  spreminja datotek izvajalca.
- Splet nima svojega `current-task.md`; vedno uporablja skupnega v
  `billero.app/docs/ai`.

## Pravila spletnega repozitorija

- Pred urejanjem preberi obstoječo datoteko in trenutni diff.
- `index.html`, `privacy-policy.html` in glavni CSS spreminjaj samo ciljno; ne
  prepisuj jih v celoti.
- Ohraniti je treba semantični HTML, dostopnost, SEO, mobilni prikaz in
  obstoječi vizualni slog.
- Upoštevaj vse trenutno vzdrževane jezike. Ne predpostavljaj, da sta edina
  jezika samo slovenski in angleški; preveri dejansko strukturo in obseg
  naloge.
- Ne spreminjaj `.env`, `.claude/worktrees/` ali neizsledljivih predajnih
  map brez izrecne naloge.
- Obstoječe spremembe so Matejeve; ne briši, prepisuj ali vračaj jih.

## Produktne trditve

Pred spremembo prodajnega besedila preveri skupni `PRODUCT-CONTRACT.md` in
dejansko kodo oziroma izdajo v `billero.app`. Ne predstavljaj testnega plana,
prevoda, backloga ali kode na neizdani veji kot že dostopne funkcije.

Posebej preveri trditve o državah, jezikih, davčni oziroma pravni skladnosti,
paketih, cenah, AI/OCR, zasebnosti, offline delovanju in razpoložljivosti v
trgovinah.

## Pogovor in preverjanje

- Claude piše v `billero.app/docs/ai/inbox-codex.md`.
- Codex piše v `billero.app/docs/ai/inbox-claude.md`.
- Uporabi obliko iz `billero.app/docs/ai/README.md` in navedi poti z imenom
  repozitorija.
- Po spremembi preveri vse prizadete strani, povezave, jezike, mobilni prikaz
  in skladnost s trenutno aplikacijo.
- Ne izvajaj commita, pusha ali produkcijskega deploya brez Matejevega
  izrecnega naročila.
- Po največ treh krogih brez soglasja nalogo označi `blokirano` in odločitev
  vrni Mateju.
