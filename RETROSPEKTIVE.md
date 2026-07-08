# Retrospektive: Rekonstruktion der Produktentscheidung "Kündigungs-Cockpit"

Diese Rekonstruktion stützt sich ausschließlich auf die im Repository vorhandenen
Dateien (MISSION.md, RESEARCH.md, DECISIONS.md, STATE.md) und die Git-Historie
(`git log`, `git show`). Es wurde keine Konversations-Erinnerung an die damaligen
Sessions verwendet, auch wenn eine solche im aktuellen Gesprächskontext prinzipiell
verfügbar wäre – die Aufgabe verlangt explizit Quellentreue statt Plausibilität. Jede
Aussage ist mit Datei/Zeile bzw. Commit-Hash belegt. Wo Dokumente lückenhaft sind,
wird das benannt statt aufgefüllt.

**Wichtiger Befund vorab:** RESEARCH.md und DECISIONS.md wurden nicht in getrennten
Commits angelegt, sondern beide erstmals im selben Commit `2bcefc6` ("Recherche
abgeschlossen, Kuendigungs-Cockpit ausgewaehlt und V1-Regelengine gebaut",
2026-07-08 14:21:07 +0200) angelegt – zusammen mit der kompletten ersten lauffähigen
Version des Tools (Regelengine, Tests, UI). RESEARCH.md wurde seither nie wieder
verändert (`git log --oneline -- RESEARCH.md` zeigt nur diesen einen Commit). Es gibt
also keine separate "Recherche-Session" und "Entscheidungs-Session" in der Historie,
die sich getrennt rekonstruieren ließen – beide Phasen sind in einem einzigen
Commit-Schnappschuss festgehalten.

---

## 1. RECHERCHE: Welche Quellen wurden tatsächlich durchsucht?

Laut RESEARCH.md, Abschnitt "Methodik-Hinweis" (RESEARCH.md:3–17):

- **Reddit-Zugriff blockiert:** curl, WebFetch, WebSearch mit `allowed_domains:
  reddit.com` und Navigation über einen echten Chrome-Browser (claude-in-chrome)
  wurden alle mit "Netzwerk-Security-Block bzw. 403" abgewiesen. RESEARCH.md
  bezeichnet das explizit als kein lösbares Bot-Detection-Problem, sondern als
  grundsätzliche Sperre in dieser Sandbox (RESEARCH.md:5–10).
- **Nicht dokumentiert:** Welche der in MISSION.md konkret vorgeschlagenen
  Subreddit-URLs (z. B. r/selbststaendig, r/Finanzen, r/de_EDV, r/Handwerker,
  r/arbeitsleben, r/wohnen) einzeln angefragt wurden, bevor auf den Fallback
  umgestellt wurde. RESEARCH.md nennt nur den allgemeinen Befund "Reddit ist
  blockiert", keine Liste einzeln getesteter Endpunkte.
- **Fallback laut RESEARCH.md:3–17:** WebSearch-Recherche nach deutschsprachigen
  Foren – namentlich genannt werden **wiwi-treff.de, vermieter-forum.com,
  gutefrage.net, elo-forum.org "u.a."** – sowie Rechtsportalen und der bestehenden
  Anbieter-Landschaft, um (a) wiederkehrende Probleme und (b) den Grad bestehender
  Tool-Abdeckung einzuschätzen.
- **Auffälligkeit:** Von den vier in der Methodik namentlich genannten Foren taucht
  in den konkreten Kandidaten-Quellenangaben (RESEARCH.md:21–64) nur
  **vermieter-forum.com** tatsächlich auf (bei Kandidat 2, RESEARCH.md:28).
  wiwi-treff.de, gutefrage.net und elo-forum.org erscheinen in keiner der acht
  Kandidaten-Quellenangaben. Ob sie recherchiert, aber ohne verwertbaren Fund
  verworfen wurden, oder ob die Methodik-Beschreibung allgemeiner gehalten ist als
  die tatsächliche Suche, ist aus dem Dokument **nicht rekonstruierbar**.

**Was pro Kandidat konkret als Quelle genannt wird** (vollständige Liste, RESEARCH.md:21–64):
Blogs/Anbieterseiten (sevdesk, tide, buhl.de, easybill, plancraft.com u. v. a.),
Rechtsportale (arbeitsrechte.de, kanzlei-hasselbach.de), ein Forum
(computerbase.de-Forum, vermieter-forum.com), Vergleichs-/Rechner-Anbieter
(rechner.app, rechnerplus.de, ordio.com, kenjo.io, personio.de), eine
Gewerkschaftsseite (ver.di) und Fachmedien (heise.de). Es handelt sich durchgehend
um **Domainnamen**, nicht um Permalinks zu einzelnen Threads/Artikeln, wie es
MISSION.md für die (blockierte) Reddit-Recherche vorgesehen hatte
("jeweils mit Quelle (Permalink)").

## 2. KANDIDATEN: Vollständige Liste aus RESEARCH.md

| # | Kandidat | Quellen (lt. RESEARCH.md) | Häufigkeit | Einschätzung |
|---|----------|---------------------------|------------|--------------|
| 1 | Buchhaltung/Steuererklärung für Kleinunternehmer | sevdesk, tide, buhl.de | sehr hoch, Dauerthema | **stark umkämpft** – sevdesk, lexoffice, WISO, Tide dominieren; "kein Platz für ein neues kostenloses Tool ohne Account" (RESEARCH.md:21–25) |
| 2 | Nebenkostenabrechnung prüfen | computerbase.de-Forum, vermieter-forum.com, nebenkosten-assistent.de | hoch, jährlich wiederkehrend | **umkämpft**, meist kostenpflichtig oder Dokumenten-Upload nötig; Prüfung "schwer robust mit reinem Code ohne Fehleranfälligkeit zu lösen" (RESEARCH.md:27–31) |
| 3 | Rechnungserstellung für Kleinunternehmer ohne Anmeldung | kostenlose-erechnung.de, easybill, rechnung-schreiben.de, kundenbuch.de | sehr hoch | **extrem umkämpft** – "mindestens 10 kostenlose Generatoren ohne Login existieren bereits"; "kein Differenzierungspotenzial" (RESEARCH.md:33–36) |
| 4 | Kündigungsfrist / Kündigungsschutzklage-Frist berechnen | arbeitsrechte.de, rechner.app, rechnerplus.de, hilfe.de/arbeit/fristenwaechter | hoch (ca. 1 Mio+ Kündigungen/Jahr in DE lt. Dokument) | **Einzelrechner umkämpft** (mind. 5 kostenlose Fristrechner existieren bereits), aber **kein Anbieter kombiniert die Frist mit weiteren gleichzeitig relevanten Fristen** (RESEARCH.md:38–42) |
| 5 | Meldepflicht bei der Arbeitsagentur nach Kündigung (Sperrzeit vermeiden) | ver.di, kanzlei-hasselbach.de, genaumeinkurs.de | hoch, aber "Wissen darüber ist gering verbreitet" | **kein dediziertes Tool gefunden**, nur Ratgeberartikel; explizit als "kombinierbar mit Punkt 4" vermerkt (RESEARCH.md:44–48) |
| 6 | Resturlaub bei unterjähriger Kündigung berechnen | ordio.com, kenjo.io, personio.de, IHK Darmstadt/Schwaben | hoch | **umkämpft**, mehrere gute kostenlose Rechner vorhanden, aber "leicht als Baustein in ein kombiniertes Kündigung-erhalten-Tool integrierbar" (RESEARCH.md:50–53) |
| 7 | Handwerker Angebote/Kostenvoranschläge | plancraft.com, tooltime.app, streit-software.de | hoch | **extrem umkämpft**, "dutzende Vorlagen-Anbieter", "SEO-übersättigt" (RESEARCH.md:55–58) |
| 8 | Scheinselbstständigkeit-Check für IT-Freelancer | gulp.de, freelancercheck.de, heise.de, accountable.de | mittel-hoch | nur statische Checklisten gefunden, **kein interaktives Score-Tool**; aber kleinere Zielgruppe, Ergebnis "naturgemäß unscharf", Risiko der Wirkung als "unseriös" (RESEARCH.md:60–64) |

## 3. ENTSCHEIDUNG: Warum Kündigungs-Cockpit – und explizit gegen jeden anderen Kandidaten

Die Wahl wird in RESEARCH.md, Abschnitt "Priorisierte Einschätzung" (RESEARCH.md:66–79),
und in DECISIONS.md, Abschnitt "Produktentscheidung: Kündigungs-Cockpit"
(DECISIONS.md:15–63 im ursprünglichen Commit `2bcefc6`, seither unverändert) begründet.

**Explizite Ablehnungsgründe pro Kandidat** (alle Zitate aus RESEARCH.md):

- **Gegen 1 (Buchhaltung):** "stark umkämpft" – etablierte Anbieter (sevdesk,
  lexoffice, WISO, Tide) dominieren vollständig, kein Marktzugang für ein neues
  kostenloses Tool ohne Account (RESEARCH.md:25).
- **Gegen 2 (Nebenkostenabrechnung):** Zwar Whitespace bei kostenlosen Tools
  erkannt, aber als technisch zu riskant eingestuft – die Prüfung sei "schwer
  robust mit reinem Code ohne Fehleranfälligkeit zu lösen" (RESEARCH.md:31). Das
  ist der einzige Kandidat, der primär an einem **Mission-Kriterium** scheitert
  ("mit reinem Code lösbar"), nicht an Marktsättigung.
- **Gegen 3 (Rechnungserstellung):** "extrem umkämpft", mindestens 10 bestehende
  kostenlose Generatoren, explizit "kein Differenzierungspotenzial" (RESEARCH.md:36).
- **Gegen 7 (Handwerker-Angebote):** "extrem umkämpft", "SEO-übersättigt"
  (RESEARCH.md:58).
- **Gegen 8 (Scheinselbstständigkeit-Check):** Differenzierungspotenzial zwar
  vorhanden (kein interaktives Tool am Markt gefunden), aber gegen eine kleinere
  Zielgruppe (v. a. IT-Freelancer) und ein strukturelles Risiko abgewogen: das
  Ergebnis sei "naturgemäß unscharf" und ein zu bestimmt klingendes Tool könnte
  "unseriös" wirken (RESEARCH.md:64).
- **Kandidaten 4, 5, 6 einzeln:** Alle drei werden als für sich genommen bereits
  gut bedient bzw. "Commodity" eingestuft (RESEARCH.md:68–69) – also **nicht**
  wegen fehlendem Bedarf verworfen, sondern weil Einzellösungen keinen
  Wettbewerbsvorteil böten.

**Positive Entscheidung:** Statt eines der acht Kandidaten einzeln umzusetzen, wurde
die **Kombination der Kandidaten 4 + 5 + 6** gewählt (RESEARCH.md:70–77): ein Tool für
den Moment direkt nach Erhalt einer Kündigung, das alle drei Fristen-Themen in einem
personalisierten Ablauf zusammenführt. Begründung wörtlich: "wurde in dieser Form –
als kombiniertes Cockpit statt Einzelrechner – bei keinem der gefundenen Anbieter
identifiziert" (RESEARCH.md:76–77).

**Abgleich mit den MISSION.md-Auswahlkriterien** (Phase 2: "Mehrfach genannt oder
erkennbar verbreitet", "Mit reinem Code lösbar", "Ohne externe API-Keys oder Accounts
baubar", "Klein genug, dass in 2-3 Wochen etwas Fertiges steht"): DECISIONS.md wendet
diese vier Kriterien **explizit und einzeln nur auf den gewählten Kandidaten** an
(DECISIONS.md:24–35 im ursprünglichen Commit):
1. "Mehrfach belegt" – unabhängige Quellen bestätigen Häufigkeit und geringe
   Bekanntheit einzelner Fristen (DECISIONS.md:25–27).
2. "Mit reinem Code lösbar" – Datumsarithmetik + Regelwerk, keine Einzelfall-
   Rechtsberatung nötig (DECISIONS.md:28–30).
3. "Keine externen Accounts/API-Keys nötig" – reine Client-Logik (DECISIONS.md:31).
4. "Klein genug für 2-3 Wochen" – Formular + Regelengine + Export + Textbausteine,
   kein Backend zwingend nötig (DECISIONS.md:32–35).

Eine vergleichbare Vier-Kriterien-Bewertung für die **anderen sieben Kandidaten**
existiert in den Dokumenten **nicht** – dort wird jeweils nur die Marktsättigung
bzw. technische Machbarkeit diskutiert (siehe Tabelle oben), nicht systematisch gegen
alle vier MISSION.md-Kriterien geprüft. Das ist keine Vermutung, sondern eine reine
Beobachtung der Dokumentstruktur.

## 4. VERWORFENES: Ideen außerhalb von RESEARCH.md?

Es findet sich **keine Spur** von Problemideen, die es nicht in RESEARCH.md geschafft
haben:

- Die Commit-Message von `2bcefc6` fasst den Vorgang zusammen, nennt aber keine
  zusätzlichen, in RESEARCH.md nicht enthaltenen Kandidaten (`git log -1 --format="%B"
  2bcefc6`).
- `git log --oneline -- RESEARCH.md` zeigt **einen einzigen Commit** – es gab nie eine
  frühere oder überschriebene Version der Datei, die andere Kandidaten enthalten haben
  könnte.
- `git log --diff-filter=D --summary` über die gesamte Historie zeigt **keine
  gelöschten Dateien** – es wurde also nie ein Entwurf (z. B. eine frühere
  RESEARCH-Draft-Datei) angelegt und wieder entfernt.
- Es existiert keine FEEDBACK.md und keine weitere Planungsdatei außer den in
  MISSION.md erlaubten (MISSION.md, STATE.md, RESEARCH.md, DECISIONS.md).

**Fazit:** Es gibt keine dokumentierten "verworfenen" Ideen außerhalb der acht
Kandidaten in RESEARCH.md. Sollte es während der damaligen Recherche-Session weitere,
schnell verworfene Ideen gegeben haben, sind sie in keinem Artefakt dieses Repositories
festgehalten worden.

## 5. LÜCKEN: Was ist aus den Dokumenten nicht mehr rekonstruierbar?

Explizit benannt statt vermutet:

- **Konkrete Suchanfragen:** Welche exakten WebSearch-Suchbegriffe zu welchem
  Kandidaten geführt haben, ist nicht dokumentiert – RESEARCH.md nennt nur die
  gefundenen Domains, keine Queries.
- **Einzelne Seiten/Permalinks:** Innerhalb der genannten Domains (z. B. "sevdesk,
  tide, buhl.de") ist nicht nachvollziehbar, welche konkreten Unterseiten/Artikel
  gelesen wurden. Das ist ein Bruch mit der in MISSION.md ursprünglich verlangten
  Permalink-Zitierweise – nachvollziehbar, weil diese für Reddit konzipiert war und
  der technische Fallback keine gleichwertige Zitierpraxis für die Ausweichquellen
  festgelegt hat.
- **Quantitative Basis der "Häufigkeit"-Einschätzung:** Werte wie "hoch", "sehr
  hoch", "mittel-hoch" sind qualitative Urteile ohne dokumentierte Kennzahl (keine
  Upvotes, keine Trefferzahlen, keine Thread-Anzahl) – anders als es die
  ursprünglich vorgesehene Reddit-Methodik (mit Upvote-/Kommentarzahlen) ermöglicht
  hätte.
- **Ob weitere, vor der Dokumentation verworfene Kandidaten existierten:** Aus den
  vorhandenen Artefakten (siehe Abschnitt 4) ist das nicht feststellbar – weder
  positiv noch negativ. Es lässt sich nur sagen: nichts dergleichen ist dokumentiert.
- **Reihenfolge der Recherche:** Ob die Nummerierung 1–8 in RESEARCH.md die
  tatsächliche chronologische Recherche-Reihenfolge widerspiegelt oder nachträglich
  für die Darstellung sortiert wurde, ist nicht erkennbar.
- **Anzahl und Abgrenzung der Sessions:** Die gesamte Recherche, die
  Produktentscheidung und der Bau der ersten lauffähigen Version liegen in einem
  einzigen Commit (`2bcefc6`, ein Zeitstempel: 2026-07-08 14:21:07 +0200). Ob dem
  intern eine oder mehrere `/session`-Aufrufe vorausgingen, lässt sich aus der
  Commit-Historie allein **nicht** rekonstruieren, da Commits keine Sub-Session-
  Grenzen speichern. (Diese Auskunft wäre nur über Konversationsverlauf verfügbar,
  der laut Aufgabenstellung hier bewusst nicht herangezogen wird.)
- **Systematischer Kriterien-Vergleich für die verworfenen Kandidaten:** Wie in
  Abschnitt 3 vermerkt, wurden die vier MISSION.md-Auswahlkriterien nur für den
  gewählten Kandidaten einzeln durchdekliniert. Ob und wie sie für die anderen
  sieben implizit mitgeprüft wurden, ist aus dem Dokument nicht ersichtlich –
  dort dominieren Marktsättigungs- und Machbarkeitsargumente.
- **Detaillierter Grund für die technische Reddit-Sperre:** RESEARCH.md und
  DECISIONS.md nennen als Befund "403 / blocked by network security", aber keine
  weiteren technischen Details (z. B. Response-Header, genaue Fehlermeldungen pro
  Zugriffsversuch).

---

*Erstellt gemäß Anfrage vom Nutzer. Nicht committet – zur Durchsicht.*
