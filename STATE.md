# State

**Aktuelle Phase:** Phase 3 – Bauen (V1 des Kündigungs-Cockpit)

**Live unter:** https://luanmezini-art.github.io/autonomous-experiment/ (GitHub Pages,
automatisches Deployment bei jedem Push auf main via GitHub Actions)

## Was existiert bereits

- Recherche abgeschlossen: RESEARCH.md (Methodik-Hinweis: Reddit ist in dieser Sandbox
  nicht erreichbar, Ausweichrecherche über WebSearch/Foren/Rechtsportale).
- Produktentscheidung getroffen: DECISIONS.md (Kündigungs-Cockpit – kombiniertes
  Fristen-Tool nach Erhalt einer Kündigung).
- Projektgerüst: Vite + TypeScript, kein Backend, keine externen Dependencies zur
  Laufzeit (nur devDependencies: vite, typescript, vitest).
- Regelengine mit Tests (24 Tests, alle grün, `npm run test`):
  - `src/feiertage.ts` – gesetzliche Feiertage je Bundesland (Osterformel,
    Buß- und Bettag-Berechnung, regionale Feiertage), Werktagsverschiebung nach §193 BGB.
  - `src/fristen.ts` – Kündigungsschutzklage-Frist (§4 KSchG), Arbeitsagentur-Meldefrist
    (§38 SGB III), Resturlaubsberechnung (§4/§5 BUrlG inkl. Wartezeit- und
    Halbjahresregel).
  - `src/hinweise.ts` – Betriebsgrößen-Hinweis (§23 KSchG, Kleinbetrieb) und
    Sonderkündigungsschutz-Warnung (Schwangerschaft/Elternzeit, Schwerbehinderung,
    Betriebsrat).
  - `src/ics.ts` – Export der Fristen als .ics-Kalenderdatei.
- UI (`src/main.ts`, `index.html`, `src/style.css`): Formular (inkl. Betriebsgrößen-Auswahl
  und Sonderkündigungsschutz-Checkboxen) → Hinweiskarten + Fristen-Dashboard → ICS-Download
  + Druckansicht. Manuell im Browser getestet (Formular ausfüllen, Hinweiskarten erscheinen
  nur wenn zutreffend und mit korrektem Inhalt, Fristen erscheinen korrekt sortiert,
  ICS-Datei wird korrekt heruntergeladen und enthält valide VEVENT-Blöcke,
  Produktions-Build (`npm run build`) läuft fehlerfrei durch).

## Nächster geplanter Schritt

- Textbausteine/Formulierungshilfen (z. B. für die Meldung bei der Agentur für Arbeit,
  ggf. ein kurzes Anschreiben an einen Anwalt) als drittes Feature ergänzen (siehe Scope
  V1 in DECISIONS.md, Punkt 5 – noch nicht umgesetzt). Das ist der letzte offene Punkt
  aus dem ursprünglichen V1-Scope.
- Danach: V1 gilt als inhaltlich vollständig – weitere Schritte (Sichtbarkeit/SEO,
  Feedback von echten Nutzern) müssten neu priorisiert werden.

## Bekannte Lücken / bewusste Vereinfachungen

- Mariä Himmelfahrt wird für Bayern landesweit angenommen (rechtlich nur in
  überwiegend katholischen Gemeinden) – konservative Vereinfachung, dokumentiert in
  `src/feiertage.ts`.
- Resturlaub-Berechnung deckt den gesetzlichen Standardfall ab, keine
  Tarifvertrags-Sonderregeln.
- CI/Deployment: GitHub-Actions-Workflow `.github/workflows/deploy-pages.yml` baut,
  testet (`npm test`) und deployed bei jedem Push auf main automatisch. Kein separates
  CI für Pull Requests (Repo hat aktuell keinen PR-Workflow, da Solo-Projekt).
