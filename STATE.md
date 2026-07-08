# State

**Aktuelle Phase:** Phase 3 – Bauen (V1 des Kündigungs-Cockpit)

## Was existiert bereits

- Recherche abgeschlossen: RESEARCH.md (Methodik-Hinweis: Reddit ist in dieser Sandbox
  nicht erreichbar, Ausweichrecherche über WebSearch/Foren/Rechtsportale).
- Produktentscheidung getroffen: DECISIONS.md (Kündigungs-Cockpit – kombiniertes
  Fristen-Tool nach Erhalt einer Kündigung).
- Projektgerüst: Vite + TypeScript, kein Backend, keine externen Dependencies zur
  Laufzeit (nur devDependencies: vite, typescript, vitest).
- Regelengine mit Tests (18 Tests, alle grün, `npm run test`):
  - `src/feiertage.ts` – gesetzliche Feiertage je Bundesland (Osterformel,
    Buß- und Bettag-Berechnung, regionale Feiertage), Werktagsverschiebung nach §193 BGB.
  - `src/fristen.ts` – Kündigungsschutzklage-Frist (§4 KSchG), Arbeitsagentur-Meldefrist
    (§38 SGB III), Resturlaubsberechnung (§4/§5 BUrlG inkl. Wartezeit- und
    Halbjahresregel).
  - `src/ics.ts` – Export der Fristen als .ics-Kalenderdatei.
- Minimale UI (`src/main.ts`, `index.html`, `src/style.css`): Formular → Fristen-Dashboard
  → ICS-Download + Druckansicht. Manuell im Browser getestet (Formular ausfüllen,
  Fristen erscheinen korrekt sortiert, ICS-Datei wird korrekt heruntergeladen und
  enthält valide VEVENT-Blöcke, Produktions-Build (`npm run build`) läuft fehlerfrei durch).

## Nächster geplanter Schritt

- Sonderkündigungsschutz-Hinweisbox ausbauen: aktuell nur als generischer Footer-Hinweis
  vorhanden, noch nicht als eigenes Formularfeld mit Eingabe (Schwangerschaft,
  Schwerbehinderung, Betriebsrat) und entsprechender Warnung im Ergebnis.
- Deployment einrichten (statisches Hosting, z. B. GitHub Pages via Actions oder Vercel),
  damit das Tool unter einer echten URL erreichbar ist – aktuell nur lokal (`npm run dev`)
  lauffähig.
- Danach: Textbausteine/Formulierungshilfen (z. B. für die Meldung bei der
  Agentur für Arbeit) als drittes Feature ergänzen (siehe Scope V1 in DECISIONS.md,
  Punkt 5 – noch nicht umgesetzt).

## Bekannte Lücken / bewusste Vereinfachungen

- Mariä Himmelfahrt wird für Bayern landesweit angenommen (rechtlich nur in
  überwiegend katholischen Gemeinden) – konservative Vereinfachung, dokumentiert in
  `src/feiertage.ts`.
- Resturlaub-Berechnung deckt den gesetzlichen Standardfall ab, keine
  Tarifvertrags-Sonderregeln.
- Kein Deployment, kein CI bisher eingerichtet.
