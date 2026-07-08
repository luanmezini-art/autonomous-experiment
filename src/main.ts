import "./style.css";
import { type Bundesland } from "./feiertage";
import {
  kuendigungsschutzklageFrist,
  arbeitsagenturMeldefrist,
  resturlaubBerechnen,
  type Frist,
} from "./fristen";
import { fristenAlsIcs } from "./ics";
import {
  betriebsgroesseHinweis,
  sonderkuendigungsschutzHinweis,
  type Betriebsgroesse,
  type Hinweis,
} from "./hinweise";
import { anwaltsanfrageText, arbeitsagenturZusammenfassungText } from "./textbausteine";
import { formularSpeichern, formularLaden, formularLoeschen, type FormularDaten } from "./formular-speicher";

const BUNDESLAENDER: Record<Bundesland, string> = {
  BW: "Baden-Württemberg",
  BY: "Bayern",
  BE: "Berlin",
  BB: "Brandenburg",
  HB: "Bremen",
  HH: "Hamburg",
  HE: "Hessen",
  MV: "Mecklenburg-Vorpommern",
  NI: "Niedersachsen",
  NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz",
  SL: "Saarland",
  SN: "Sachsen",
  ST: "Sachsen-Anhalt",
  SH: "Schleswig-Holstein",
  TH: "Thüringen",
};

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <header>
    <h1>Kündigungs-Cockpit</h1>
    <p class="untertitel">Alle Fristen nach einer Kündigung – auf einen Blick, kostenlos, ohne Anmeldung.</p>
  </header>

  <div class="hinweisbox">
    Alle Eingaben bleiben ausschließlich in Ihrem Browser (lokal gespeichert,
    damit sie bei einem versehentlichen Neuladen nicht verloren gehen) – es
    wird nichts an einen Server gesendet. Mit dem Button "Eingaben löschen"
    entfernen Sie alles wieder. Dieses Tool ersetzt keine Rechtsberatung im
    Einzelfall, sondern zeigt die gesetzlichen Fristen nach der
    Standardregelung.
  </div>

  <form id="formular">
    <fieldset>
      <legend>Kündigung</legend>
      <div class="feld-zeile">
        <div class="feld">
          <label for="zugangsdatum">Wann haben Sie die Kündigung erhalten?</label>
          <input type="date" id="zugangsdatum" required />
          <p class="hilfetext">Tag des tatsächlichen Zugangs (Briefkasten/Übergabe), nicht das Datum auf dem Brief.</p>
        </div>
        <div class="feld">
          <label for="bundesland">Bundesland (für Feiertage)</label>
          <select id="bundesland" required></select>
        </div>
      </div>
      <div class="feld">
        <label for="beendigungsdatum">Letzter Arbeitstag / Ende des Arbeitsverhältnisses</label>
        <input type="date" id="beendigungsdatum" required />
      </div>
      <div class="feld">
        <label for="arbeitgeber">Name des Arbeitgebers (optional, nur für Textbausteine)</label>
        <input type="text" id="arbeitgeber" placeholder="z. B. Musterfirma GmbH" />
      </div>
    </fieldset>

    <fieldset>
      <legend>Urlaub</legend>
      <div class="feld-zeile">
        <div class="feld">
          <label for="beschaeftigt-seit">Beschäftigt seit</label>
          <input type="date" id="beschaeftigt-seit" required />
        </div>
        <div class="feld">
          <label for="jahresurlaub">Jahresurlaub (Tage)</label>
          <input type="number" id="jahresurlaub" min="0" step="0.5" value="20" required />
        </div>
        <div class="feld">
          <label for="genommene-tage">Bereits genommene Urlaubstage in diesem Jahr</label>
          <input type="number" id="genommene-tage" min="0" step="0.5" value="0" required />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>Kündigungsschutz</legend>
      <div class="feld">
        <label for="betriebsgroesse">Wie viele Beschäftigte hat der Betrieb ungefähr?</label>
        <select id="betriebsgroesse" required>
          <option value="ueber10">Mehr als 10</option>
          <option value="bis10">10 oder weniger</option>
          <option value="unklar">Weiß ich nicht</option>
        </select>
      </div>
      <div class="feld">
        <label>Trifft etwas davon auf Sie zu?</label>
        <label class="checkbox-zeile"><input type="checkbox" id="schwangerschaft" /> Schwangerschaft oder Elternzeit</label>
        <label class="checkbox-zeile"><input type="checkbox" id="schwerbehinderung" /> Schwerbehinderung oder Gleichstellung</label>
        <label class="checkbox-zeile"><input type="checkbox" id="betriebsrat" /> Mitglied im Betriebs-/Personalrat</label>
      </div>
    </fieldset>

    <p id="formular-fehler" class="fehlertext" hidden></p>
    <div class="aktionen">
      <button type="submit" class="primaer">Fristen berechnen</button>
      <button type="button" id="eingaben-loeschen" class="sekundaer">Eingaben löschen</button>
    </div>
  </form>

  <div id="ergebnis" hidden>
    <div class="aktionen">
      <button id="ics-download" class="sekundaer" type="button">Kalender-Datei (.ics) herunterladen</button>
      <button id="drucken" class="sekundaer" type="button">Checkliste drucken</button>
    </div>
    <div id="hinweise-liste"></div>
    <div id="fristen-liste"></div>
    <div id="urlaub-ergebnis"></div>

    <h2 class="abschnitt-titel">Formulierungshilfen</h2>
    <div class="textbaustein-karte">
      <div class="titel">Dringende Anfrage an eine Kanzlei</div>
      <p class="hilfetext">Zum Kopieren in eine E-Mail an einen Fachanwalt für Arbeitsrecht oder den gewerkschaftlichen Rechtsschutz.</p>
      <textarea id="text-anwaltsanfrage" readonly rows="10"></textarea>
      <button type="button" class="sekundaer" data-copy-target="text-anwaltsanfrage">Text kopieren</button>
    </div>
    <div class="textbaustein-karte">
      <div class="titel">Angaben für die Meldung bei der Agentur für Arbeit</div>
      <p class="hilfetext">Zum Vorlesen am Telefon, Einfügen in ein Online-Kontaktformular oder Ausdrucken für den Termin.</p>
      <textarea id="text-arbeitsagentur" readonly rows="8"></textarea>
      <button type="button" class="sekundaer" data-copy-target="text-arbeitsagentur">Text kopieren</button>
    </div>
  </div>

  <footer>
    Kündigungs-Cockpit berechnet Fristen nach §4 KSchG, §187/188/193 BGB,
    §38 SGB III und §4/§5 BUrlG für den gesetzlichen Standardfall. Bei
    Tarifverträgen, Betriebsvereinbarungen oder Sonderkündigungsschutz
    (Schwangerschaft, Schwerbehinderung, Betriebsrat) können abweichende
    Regeln gelten – ziehen Sie im Zweifel eine Rechtsberatung hinzu.
  </footer>
`;

const bundeslandSelect = document.querySelector<HTMLSelectElement>("#bundesland")!;
for (const [code, name] of Object.entries(BUNDESLAENDER)) {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = name;
  bundeslandSelect.appendChild(option);
}

function parseDate(value: string): Date {
  const [jahr, monat, tag] = value.split("-").map(Number);
  return new Date(Date.UTC(jahr, monat - 1, tag));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function istDringend(datum: Date): boolean {
  const heute = new Date();
  const heuteUtc = Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate());
  const tageBisFrist = (datum.getTime() - heuteUtc) / (1000 * 60 * 60 * 24);
  return tageBisFrist <= 7;
}

let aktuelleFristen: Frist[] = [];

const formular = document.querySelector<HTMLFormElement>("#formular")!;
const ergebnisContainer = document.querySelector<HTMLDivElement>("#ergebnis")!;
const hinweiseListe = document.querySelector<HTMLDivElement>("#hinweise-liste")!;
const fristenListe = document.querySelector<HTMLDivElement>("#fristen-liste")!;
const urlaubErgebnis = document.querySelector<HTMLDivElement>("#urlaub-ergebnis")!;
const formularFehler = document.querySelector<HTMLParagraphElement>("#formular-fehler")!;

function renderHinweise(hinweise: Hinweis[]): void {
  hinweiseListe.innerHTML = hinweise
    .map(
      (hinweis) => `
        <div class="hinweis-karte ${hinweis.stufe}">
          <div class="titel">${hinweis.titel}</div>
          <p class="erklaerung">${hinweis.text}</p>
        </div>`,
    )
    .join("");
}

function leseFormularDaten(): FormularDaten {
  return {
    zugangsdatum: (document.querySelector<HTMLInputElement>("#zugangsdatum")!).value,
    bundesland: bundeslandSelect.value,
    beendigungsdatum: (document.querySelector<HTMLInputElement>("#beendigungsdatum")!).value,
    arbeitgeber: (document.querySelector<HTMLInputElement>("#arbeitgeber")!).value,
    beschaeftigtSeit: (document.querySelector<HTMLInputElement>("#beschaeftigt-seit")!).value,
    jahresurlaub: (document.querySelector<HTMLInputElement>("#jahresurlaub")!).value,
    genommeneTage: (document.querySelector<HTMLInputElement>("#genommene-tage")!).value,
    betriebsgroesse: (document.querySelector<HTMLSelectElement>("#betriebsgroesse")!).value,
    schwangerschaft: (document.querySelector<HTMLInputElement>("#schwangerschaft")!).checked,
    schwerbehinderung: (document.querySelector<HTMLInputElement>("#schwerbehinderung")!).checked,
    betriebsrat: (document.querySelector<HTMLInputElement>("#betriebsrat")!).checked,
  };
}

function schreibeFormularDaten(daten: FormularDaten): void {
  (document.querySelector<HTMLInputElement>("#zugangsdatum")!).value = daten.zugangsdatum;
  bundeslandSelect.value = daten.bundesland;
  (document.querySelector<HTMLInputElement>("#beendigungsdatum")!).value = daten.beendigungsdatum;
  (document.querySelector<HTMLInputElement>("#arbeitgeber")!).value = daten.arbeitgeber;
  (document.querySelector<HTMLInputElement>("#beschaeftigt-seit")!).value = daten.beschaeftigtSeit;
  (document.querySelector<HTMLInputElement>("#jahresurlaub")!).value = daten.jahresurlaub;
  (document.querySelector<HTMLInputElement>("#genommene-tage")!).value = daten.genommeneTage;
  (document.querySelector<HTMLSelectElement>("#betriebsgroesse")!).value = daten.betriebsgroesse;
  (document.querySelector<HTMLInputElement>("#schwangerschaft")!).checked = daten.schwangerschaft;
  (document.querySelector<HTMLInputElement>("#schwerbehinderung")!).checked = daten.schwerbehinderung;
  (document.querySelector<HTMLInputElement>("#betriebsrat")!).checked = daten.betriebsrat;
}

const gespeicherteDaten = formularLaden(window.localStorage);
if (gespeicherteDaten) {
  schreibeFormularDaten(gespeicherteDaten);
}

formular.addEventListener("input", () => {
  formularSpeichern(leseFormularDaten(), window.localStorage);
});

document.querySelector<HTMLButtonElement>("#eingaben-loeschen")!.addEventListener("click", () => {
  formularLoeschen(window.localStorage);
  formular.reset();
  formularFehler.hidden = true;
  ergebnisContainer.hidden = true;
});

formular.addEventListener("submit", (event) => {
  event.preventDefault();

  const zugangsdatum = parseDate((document.querySelector<HTMLInputElement>("#zugangsdatum")!).value);
  const bundesland = bundeslandSelect.value as Bundesland;
  const beendigungsdatum = parseDate((document.querySelector<HTMLInputElement>("#beendigungsdatum")!).value);
  const beschaeftigtSeit = parseDate((document.querySelector<HTMLInputElement>("#beschaeftigt-seit")!).value);
  const jahresurlaub = Number((document.querySelector<HTMLInputElement>("#jahresurlaub")!).value);
  const genommeneTage = Number((document.querySelector<HTMLInputElement>("#genommene-tage")!).value);
  const arbeitgeber = (document.querySelector<HTMLInputElement>("#arbeitgeber")!).value;
  const betriebsgroesse = (document.querySelector<HTMLSelectElement>("#betriebsgroesse")!).value as Betriebsgroesse;
  const schwangerschaft = (document.querySelector<HTMLInputElement>("#schwangerschaft")!).checked;
  const schwerbehinderung = (document.querySelector<HTMLInputElement>("#schwerbehinderung")!).checked;
  const betriebsrat = (document.querySelector<HTMLInputElement>("#betriebsrat")!).checked;

  if (beendigungsdatum.getTime() < zugangsdatum.getTime()) {
    formularFehler.textContent =
      "Das Ende des Arbeitsverhältnisses kann nicht vor dem Zugang der Kündigung liegen. Bitte prüfen Sie die Daten.";
    formularFehler.hidden = false;
    ergebnisContainer.hidden = true;
    return;
  }

  if (beschaeftigtSeit.getTime() > beendigungsdatum.getTime()) {
    formularFehler.textContent =
      "Der Beschäftigungsbeginn kann nicht nach dem Ende des Arbeitsverhältnisses liegen. Bitte prüfen Sie die Daten.";
    formularFehler.hidden = false;
    ergebnisContainer.hidden = true;
    return;
  }

  formularFehler.hidden = true;

  const hinweise = [
    sonderkuendigungsschutzHinweis({
      schwangerschaftOderElternzeit: schwangerschaft,
      schwerbehinderung,
      betriebsratsmitglied: betriebsrat,
    }),
    betriebsgroesseHinweis(betriebsgroesse),
  ].filter((hinweis): hinweis is Hinweis => hinweis !== null);
  renderHinweise(hinweise);

  const klagefrist = kuendigungsschutzklageFrist(zugangsdatum, bundesland);
  const meldefrist = arbeitsagenturMeldefrist(zugangsdatum, beendigungsdatum);
  const urlaub = resturlaubBerechnen({
    jahresurlaubstage: jahresurlaub,
    bereitsGenommeneTage: genommeneTage,
    beschaeftigtSeit,
    beendigungsDatum: beendigungsdatum,
  });

  aktuelleFristen = [klagefrist, meldefrist].sort((a, b) => a.datum.getTime() - b.datum.getTime());

  fristenListe.innerHTML = aktuelleFristen
    .map(
      (frist) => `
        <div class="frist-karte ${istDringend(frist.datum) ? "dringend" : ""}">
          <div class="datum">${formatDate(frist.datum)}</div>
          <div class="titel">${frist.titel}</div>
          <p class="erklaerung">${frist.erklaerung}</p>
          <p class="rechtsgrundlage">Rechtsgrundlage: ${frist.rechtsgrundlage}</p>
        </div>`,
    )
    .join("");

  urlaubErgebnis.innerHTML = `
    <div class="urlaub-karte">
      <div class="titel">Resturlaub: ${urlaub.resturlaubstage} Tage</div>
      <p class="erklaerung">${urlaub.erklaerung}</p>
    </div>`;

  const textbausteinEingabe = {
    arbeitgeber,
    zugangsdatum,
    klagefristDatum: klagefrist.datum,
    letzterArbeitstag: beendigungsdatum,
  };
  (document.querySelector<HTMLTextAreaElement>("#text-anwaltsanfrage")!).value =
    anwaltsanfrageText(textbausteinEingabe);
  (document.querySelector<HTMLTextAreaElement>("#text-arbeitsagentur")!).value =
    arbeitsagenturZusammenfassungText(textbausteinEingabe);

  ergebnisContainer.hidden = false;
  ergebnisContainer.scrollIntoView({ behavior: "smooth" });
});

document.querySelector<HTMLButtonElement>("#ics-download")!.addEventListener("click", () => {
  const ics = fristenAlsIcs(aktuelleFristen);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kuendigungs-fristen.ics";
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector<HTMLButtonElement>("#drucken")!.addEventListener("click", () => {
  window.print();
});

document.querySelectorAll<HTMLButtonElement>("[data-copy-target]").forEach((button) => {
  const urspruenglicherText = button.textContent;

  button.addEventListener("click", async () => {
    const targetId = button.dataset.copyTarget!;
    const textarea = document.querySelector<HTMLTextAreaElement>(`#${targetId}`)!;

    try {
      await navigator.clipboard.writeText(textarea.value);
      button.textContent = "Kopiert!";
    } catch {
      // Clipboard-API kann z. B. ohne Dokument-Fokus fehlschlagen – Text
      // wird dann wenigstens für manuelles Kopieren (Strg+C) markiert.
      textarea.focus();
      textarea.select();
      button.textContent = "Bitte manuell kopieren (Strg+C)";
    }

    setTimeout(() => {
      button.textContent = urspruenglicherText;
    }, 2000);
  });
});
