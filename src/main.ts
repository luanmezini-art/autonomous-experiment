import "./style.css";
import { type Bundesland } from "./feiertage";
import {
  kuendigungsschutzklageFrist,
  arbeitsagenturMeldefrist,
  resturlaubBerechnen,
  type Frist,
} from "./fristen";
import { fristenAlsIcs } from "./ics";

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
    Alle Eingaben bleiben in Ihrem Browser – es wird nichts an einen Server
    gesendet und nichts gespeichert. Dieses Tool ersetzt keine
    Rechtsberatung im Einzelfall, sondern zeigt die gesetzlichen Fristen
    nach der Standardregelung.
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

    <button type="submit" class="primaer">Fristen berechnen</button>
  </form>

  <div id="ergebnis" hidden>
    <div class="aktionen">
      <button id="ics-download" class="sekundaer" type="button">Kalender-Datei (.ics) herunterladen</button>
      <button id="drucken" class="sekundaer" type="button">Checkliste drucken</button>
    </div>
    <div id="fristen-liste"></div>
    <div id="urlaub-ergebnis"></div>
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
const fristenListe = document.querySelector<HTMLDivElement>("#fristen-liste")!;
const urlaubErgebnis = document.querySelector<HTMLDivElement>("#urlaub-ergebnis")!;

formular.addEventListener("submit", (event) => {
  event.preventDefault();

  const zugangsdatum = parseDate((document.querySelector<HTMLInputElement>("#zugangsdatum")!).value);
  const bundesland = bundeslandSelect.value as Bundesland;
  const beendigungsdatum = parseDate((document.querySelector<HTMLInputElement>("#beendigungsdatum")!).value);
  const beschaeftigtSeit = parseDate((document.querySelector<HTMLInputElement>("#beschaeftigt-seit")!).value);
  const jahresurlaub = Number((document.querySelector<HTMLInputElement>("#jahresurlaub")!).value);
  const genommeneTage = Number((document.querySelector<HTMLInputElement>("#genommene-tage")!).value);

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
