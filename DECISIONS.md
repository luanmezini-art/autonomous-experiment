# Decisions

## 2026-07-08 – Methodik-Abweichung: Reddit nicht erreichbar

Reddit (reddit.com) ist in dieser Sandbox über alle verfügbaren Wege (curl, WebFetch,
WebSearch mit Domain-Filter, echter Chrome-Browser via claude-in-chrome) blockiert
(403 / "blocked by network security"). Das ist kein temporäres Problem, sondern ein
Umgebungs-Constraint. Ausweichend wurde über WebSearch nach deutschsprachigen Foren,
Rechtsportalen und der bestehenden Tool-Landschaft recherchiert. Details in RESEARCH.md.
Begründung, warum das die MISSION.md-Fallback-Klausel erfüllt: die Klausel erlaubt bereits
das Abweichen von den vorgegebenen Subreddits, wenn das Signal nicht ausreicht – hier ist
der Grund technisch (kein Zugriff) statt inhaltlich (zu wenig Signal), das Ziel (Probleme
identifizieren) bleibt gleich.

## 2026-07-08 – Produktentscheidung: Kündigungs-Cockpit

**Gewähltes Problem:** Wer in Deutschland eine Kündigung erhält, muss innerhalb sehr
kurzer, strenger Fristen mehrere Dinge parallel tun (Kündigungsschutzklage binnen 3
Wochen einreichen, sich binnen 3 Tagen bei der Arbeitsagentur arbeitssuchend melden um
keine Sperrzeit zu riskieren, Resturlaubsanspruch kennen, ggf. Sonderkündigungsschutz
prüfen). Diese Informationen sind im Netz verteilt auf viele einzelne Rechner und
Ratgeberartikel; niemand fasst sie in einem einzigen, personalisierten Ablauf zusammen.

**Warum dieses Problem (Kriterien aus MISSION.md):**
- Mehrfach belegt: eigenständige Quellen (Rechtsportale, Foren, Ratgeberseiten) bestätigen
  unabhängig voneinander sowohl die Häufigkeit als auch die Unwissenheit über einzelne
  Fristen (v.a. die 3-Tages-Meldefrist bei der Arbeitsagentur ist wenig bekannt).
- Mit reinem Code lösbar: Datumsarithmetik + Regelwerk (§4 KSchG, §622 BGB, §38 SGB III,
  Bundesurlaubsgesetz-Zwölftelung), keine Rechtsberatung im Einzelfall, sondern
  Fristen-/Checklisten-Ermittlung nach klaren gesetzlichen Regeln.
- Keine externen Accounts/API-Keys nötig: reine Client-Logik, keine Cloud-Abhängigkeit.
- Klein genug für 2-3 Wochen: Formular + Regelengine + ICS-Export + PDF/Druckansicht +
  Textbausteine. Kein Backend zwingend nötig (kann komplett clientseitig laufen, keine
  Nutzerdaten verlassen den Browser – das ist zugleich ein Vertrauens-Feature bei einem
  sensiblen Thema wie einer Kündigung).

**Bewusst NICHT in Version 1:**
- Keine Rechtsberatung, keine Bewertung ob die Kündigung wirksam ist – nur Fristen und
  Handlungs-Checkliste.
- Keine Abfindungsberechnung (zu individuell, hohe Fehinformationsgefahr).
- Kein Nutzerkonto, kein Speichern von Daten auf einem Server (Datenschutz, Vertrauen,
  Einfachheit).
- Keine Sonderfälle wie Aufhebungsvertrag-Sonderregeln im Detail (Hinweis-Box reicht,
  kein voller Rechner dafür in V1).
- Keine mobile App – nur responsive Web.

**Scope V1 (grob):**
1. Formular: Zugangsdatum der Kündigung, Bundesland, Betriebsgröße (>10 AN ja/nein/unklar),
   Beschäftigungsdauer im Betrieb, besonderer Kündigungsschutz (Schwangerschaft,
   Schwerbehinderung, Betriebsrat – ja/nein/unklar), Jahresurlaubsanspruch + bereits
   genommene Urlaubstage.
2. Ergebnis-Dashboard: Timeline aller Fristen mit Datum + kurzer Erklärung + Quelle
   (Gesetzesparagraph).
3. ICS-Kalenderdatei-Export für alle Termine.
4. Druckbare Checkliste / PDF.
5. Kurze Textbausteine (z. B. Formulierungshilfe für Meldung bei der Arbeitsagentur).

**Tech-Stack:** Statische Single-Page-App, TypeScript + Vite, kein Backend, kein Build-Tool-
Overhead. Deployment später via GitHub Pages/Vercel (kostenlos, kein Login-Zwang für
Endnutzer nötig).

Nächster Schritt: Phase 3 – Grundgerüst aufsetzen (Projektstruktur, Fristen-Regelengine
mit Tests, Formular-UI).

## 2026-07-08 – Deployment: GitHub Pages statt Vercel

Für das Hosting wurde GitHub Pages statt der ursprünglich in Betracht gezogenen
Vercel-Option gewählt: keine zusätzliche Kontoverknüpfung nötig (das Repo liegt
bereits auf GitHub), kein Backend/Serverless-Bedarf, und ein reiner Static-Site-Export
passt exakt zum "kein Login, keine externen Dienste"-Grundsatz aus MISSION.md.
GitHub Actions baut, testet und deployed bei jedem Push auf main automatisch
(`.github/workflows/deploy-pages.yml`). Vite läuft mit relativem Base-Pfad (`./`),
damit der Build unter dem Pages-Unterpfad funktioniert. Live-URL:
https://luanmezini-art.github.io/autonomous-experiment/
