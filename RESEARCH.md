# Research – Phase 1

## Methodik-Hinweis (wichtig)

Der in MISSION.md vorgesehene Weg (Reddit JSON-Endpunkte wie `/top.json`) ist in dieser
Umgebung **nicht nutzbar**: sowohl direkter `curl`-Zugriff, `WebFetch`, `WebSearch` mit
`allowed_domains: reddit.com` als auch Navigation über einen echten Chrome-Browser
(claude-in-chrome) werden von Reddit mit einem Netzwerk-Security-Block bzw. 403
abgewiesen. Das ist kein Bot-Detection-Problem, das sich durch andere User-Agents lösen
ließe – der Zugriff ist in dieser Sandbox grundsätzlich blockiert.

Fallback (durch MISSION.md gedeckt: "Fallback: ... lies zusätzlich englische Subreddits"
– hier weiter ausgelegt auf: andere Quellen, wenn Subreddits technisch nicht erreichbar
sind): Recherche über WebSearch nach deutschsprachigen Foren (wiwi-treff.de,
vermieter-forum.com, gutefrage.net, elo-forum.org u.a.), Rechtsportale und
Anbieter-Landschaft, um (a) wiederkehrende Probleme und (b) den Grad der bestehenden
Tool-Abdeckung (= wie umkämpft ist die Nische) einzuschätzen.

## Kandidaten

### 1. Buchhaltung/Steuererklärung für Kleinunternehmer
- Quelle: diverse Blogs (sevdesk, tide, buhl.de), Suche vom 2026-07-08
- Problem: Belege verlieren, Umsatzsteuer-Grenze (22.000€) übersehen, Fehler bei Betriebsausgaben
- Häufigkeit: sehr hoch, Dauerthema
- Einschätzung: **stark umkämpft** – sevdesk, lexoffice, WISO, Tide etc. dominieren komplett. Kein Platz für ein neues kostenloses Tool ohne Account.

### 2. Nebenkostenabrechnung prüfen
- Quelle: computerbase.de Forum, vermieter-forum.com, nebenkosten-assistent.de
- Problem: Mieter können Betriebskostenabrechnungen schwer auf Fehler/Umlagefähigkeit prüfen
- Häufigkeit: hoch (jährlich wiederkehrend, jeder Mieter betroffen)
- Einschätzung: **umkämpft**, aber die meisten Tools sind kostenpflichtig (9,99€ KI-Tool) oder erfordern Upload sensibler Dokumente. Eine rein clientseitige, kostenlose Rechenhilfe ohne Upload wäre denkbar, aber die Prüfung erfordert Verständnis komplexer Abrechnungspositionen – schwer robust mit "reinem Code" ohne Fehleranfälligkeit zu lösen.

### 3. Rechnungserstellung für Kleinunternehmer ohne Anmeldung
- Quelle: kostenlose-erechnung.de, easybill, rechnung-schreiben.de, kundenbuch.de
- Häufigkeit: sehr hoch
- Einschätzung: **extrem umkämpft** – mindestens 10 kostenlose Generatoren ohne Login existieren bereits, teils mit XRechnung/ZUGFeRD-Support. Kein Differenzierungspotenzial.

### 4. Kündigungsfrist / Kündigungsschutzklage-Frist berechnen
- Quelle: arbeitsrechte.de, rechner.app, rechnerplus.de, hilfe.de/arbeit/fristenwaechter
- Problem: 3-Wochen-Frist für Kündigungsschutzklage ist streng (§4 KSchG), wird oft verpasst; Frist beginnt erst am Folgetag, Sonderregeln bei Zugang
- Häufigkeit: hoch (jeder, der gekündigt wird – ca. 1 Mio+ Kündigungen/Jahr in DE)
- Einschätzung: **einzelne Rechner umkämpft** (mind. 5 kostenlose Fristrechner existieren bereits als isoliertes Tool). Aber: keiner davon kombiniert die Frist mit den *weiteren* Fristen, die im selben Moment relevant sind (siehe Punkt 5) zu einem Gesamt-Überblick. Reine Einzel-Rechner sind Commodity, ein kombiniertes Tool nicht.

### 5. Meldepflicht bei der Arbeitsagentur nach Kündigung (Sperrzeit vermeiden)
- Quelle: ver.di, kanzlei-hasselbach.de, genaumeinkurs.de
- Problem: 3-Tages-Frist zur "Arbeitssuchend"-Meldung nach Erhalt der Kündigung wird oft nicht gekannt; Versäumnis führt zu einwöchiger Sperrzeit beim ALG1
- Häufigkeit: hoch, aber Wissen darüber ist gering verbreitet (kein aktives Suchverhalten dafür, da unbekannt)
- Einschätzung: kein dediziertes Tool gefunden, nur Ratgeberartikel. Kombinierbar mit Punkt 4.

### 6. Resturlaub bei unterjähriger Kündigung berechnen
- Quelle: ordio.com, kenjo.io, personio.de, IHK Darmstadt/Schwaben
- Häufigkeit: hoch
- Einschätzung: **umkämpft**, mehrere kostenlose Rechner (Ordio, Kenjo, Personio) bereits vorhanden, gut gemacht. Aber leicht als Baustein in ein kombiniertes "Kündigung erhalten"-Tool integrierbar (Zusatznutzen statt Konkurrenzprodukt).

### 7. Handwerker Angebote/Kostenvoranschläge
- Quelle: plancraft.com, tooltime.app, streit-software.de
- Häufigkeit: hoch
- Einschätzung: **extrem umkämpft**, dutzende Vorlagen-Anbieter, Nische bereits SEO-übersättigt.

### 8. Scheinselbstständigkeit-Check für IT-Freelancer
- Quelle: gulp.de, freelancercheck.de, heise.de, accountable.de
- Problem: Unsicherheit, ob Auftragsverhältnis als Scheinselbstständigkeit gilt (Weisungsgebundenheit, Eingliederung, Ein-Auftraggeber-Abhängigkeit); reale finanzielle Konsequenzen (Nachzahlung bis 5 Jahre rückwirkend)
- Häufigkeit: mittel-hoch, wiederkehrend in Freelancer-Communities
- Einschätzung: Nur statische Checklisten/PDF-Downloads gefunden, **kein interaktives Score-Tool** mit Begründung pro Kriterium. Differenzierungspotenzial vorhanden, aber Zielgruppe kleiner (v.a. IT-Freelancer) und Ergebnis ist naturgemäß unscharf (Einzelfallprüfung) – Risiko, dass Tool als "unseriös" wahrgenommen wird, wenn es zu bestimmt klingt.

## Priorisierte Einschätzung

Die Einzel-Rechner-Nischen (Kündigungsfrist, Minijob, Urlaub, Rechnung) sind alle für sich
genommen bereits gut bedient – neue isolierte Rechner haben keinen Wettbewerbsvorteil.
Der klarste Whitespace: **Kandidaten 4 + 5 + 6 kombiniert** zu einem einzigen Tool, das
jemand direkt nach Erhalt einer Kündigung nutzt: alle relevanten Fristen auf einen Blick,
personalisiert nach Eingaben (Zugangsdatum, Bundesland, Betriebsgröße, Beschäftigungsdauer,
Sonderkündigungsschutz), mit Kalender-Export (.ics) und Checkliste/Textbausteinen. Das ist
mit reinem Code (Datumslogik + Regelwerk, keine externen APIs) lösbar, adressiert einen
hochemotionalen, realen, wiederkehrenden DACH-Moment (Kündigung erhalten), und wurde in
dieser Form – als kombiniertes Cockpit statt Einzelrechner – bei keinem der gefundenen
Anbieter identifiziert.

Details zur Entscheidung: siehe DECISIONS.md.
