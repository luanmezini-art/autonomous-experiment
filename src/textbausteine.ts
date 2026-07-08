export interface TextbausteinEingabe {
  arbeitgeber: string;
  zugangsdatum: Date;
  klagefristDatum: Date;
  letzterArbeitstag: Date;
}

function formatDatumKurz(date: Date): string {
  const tag = String(date.getUTCDate()).padStart(2, "0");
  const monat = String(date.getUTCMonth() + 1).padStart(2, "0");
  const jahr = date.getUTCFullYear();
  return `${tag}.${monat}.${jahr}`;
}

/**
 * Formulierungshilfe für eine kurzfristige Anfrage bei einer Kanzlei bzw.
 * beim gewerkschaftlichen Rechtsschutz. Enthält bewusst Platzhalter für
 * Name/Kontaktdaten, da diese nicht abgefragt werden (keine
 * personenbezogenen Daten sollen über das Formular hinaus verarbeitet
 * werden müssen).
 */
export function anwaltsanfrageText(eingabe: TextbausteinEingabe): string {
  const arbeitgeberName = eingabe.arbeitgeber.trim() || "meinem Arbeitgeber";

  return `Betreff: Dringende Anfrage – Beratung zu einer Kündigung (Frist läuft am ${formatDatumKurz(eingabe.klagefristDatum)} ab)

Sehr geehrte Damen und Herren,

am ${formatDatumKurz(eingabe.zugangsdatum)} habe ich eine Kündigung von ${arbeitgeberName} erhalten. Mein letzter Arbeitstag wäre der ${formatDatumKurz(eingabe.letzterArbeitstag)}.

Die gesetzliche Frist zur Erhebung einer Kündigungsschutzklage läuft nach meiner Berechnung am ${formatDatumKurz(eingabe.klagefristDatum)} ab. Ich möchte daher möglichst kurzfristig einen Termin zur Beratung vereinbaren, ob und wie ich gegen die Kündigung vorgehen sollte.

Bitte teilen Sie mir mit, ob und wann ein kurzfristiger Termin möglich ist. Die Kündigung und meinen Arbeitsvertrag kann ich Ihnen vorab per E-Mail zusenden.

Mit freundlichen Grüßen
[Ihr Name]
[Ihre Telefonnummer]`;
}

/**
 * Zusammenfassung der Kerndaten für die Meldung bei der Agentur für
 * Arbeit (telefonisch, online oder vor Ort) plus Hinweis auf mitzubringende
 * Unterlagen.
 */
export function arbeitsagenturZusammenfassungText(eingabe: TextbausteinEingabe): string {
  const arbeitgeberName = eingabe.arbeitgeber.trim() || "[Name des Arbeitgebers]";

  return `Angaben für die Meldung bei der Agentur für Arbeit:

- Kündigung erhalten am: ${formatDatumKurz(eingabe.zugangsdatum)}
- Letzter Arbeitstag / Ende des Arbeitsverhältnisses: ${formatDatumKurz(eingabe.letzterArbeitstag)}
- Arbeitgeber: ${arbeitgeberName}

Bitte halten Sie zusätzlich bereit: das Kündigungsschreiben, Ihren Personalausweis,
Ihre Sozialversicherungsnummer sowie – falls schon vorhanden – eine
Arbeitsbescheinigung Ihres Arbeitgebers.`;
}
