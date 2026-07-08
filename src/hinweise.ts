export interface Hinweis {
  id: string;
  titel: string;
  text: string;
  stufe: "warnung" | "info";
}

export type Betriebsgroesse = "ueber10" | "bis10" | "unklar";

/**
 * §23 Abs. 1 KSchG: Der allgemeine Kündigungsschutz (soziale Rechtfertigung
 * nach §1 KSchG) gilt nur in Betrieben mit in der Regel mehr als 10
 * beschäftigten Arbeitnehmern (Teilzeitkräfte anteilig gezählt). Das
 * ändert nichts an der 3-Wochen-Klagefrist selbst (§4 KSchG gilt auch für
 * "aus anderen Gründen" unwirksame Kündigungen, z. B. Formfehler,
 * Diskriminierung, fehlende Zustimmung bei Sonderkündigungsschutz), wohl
 * aber an den Erfolgsaussichten einer reinen Sozialwidrigkeits-Klage.
 */
export function betriebsgroesseHinweis(betriebsgroesse: Betriebsgroesse): Hinweis | null {
  if (betriebsgroesse === "ueber10") {
    return null;
  }

  if (betriebsgroesse === "bis10") {
    return {
      id: "betriebsgroesse-kleinbetrieb",
      titel: "Kleinbetrieb: allgemeiner Kündigungsschutz greift meist nicht",
      text:
        "Nach Ihren Angaben hat der Betrieb 10 oder weniger Beschäftigte. Der " +
        "allgemeine Kündigungsschutz nach dem Kündigungsschutzgesetz (KSchG) " +
        "gilt dann in der Regel nicht – der Arbeitgeber muss die Kündigung " +
        "nicht sozial rechtfertigen. Die 3-Wochen-Frist für die " +
        "Kündigungsschutzklage gilt trotzdem, falls Sie die Kündigung aus " +
        "anderen Gründen anfechten wollen (z. B. Formfehler, Diskriminierung, " +
        "fehlende Zustimmung bei besonderem Kündigungsschutz).",
      stufe: "info",
    };
  }

  return {
    id: "betriebsgroesse-unklar",
    titel: "Betriebsgröße unklar",
    text:
      "Für die Anwendbarkeit des allgemeinen Kündigungsschutzes zählen alle " +
      "regelmäßig beschäftigten Arbeitnehmer, Teilzeitkräfte anteilig nach " +
      "Wochenstunden. Prüfen Sie diese Zahl im Zweifel genauer oder lassen " +
      "Sie sich beraten – sie kann über den Erfolg einer Klage entscheiden.",
    stufe: "info",
  };
}

export interface SonderkuendigungsschutzGruende {
  schwangerschaftOderElternzeit: boolean;
  schwerbehinderung: boolean;
  betriebsratsmitglied: boolean;
}

/**
 * Bei besonderem Kündigungsschutz (§17 MuSchG, §18 BEEG, §168 SGB IX, §15
 * KSchG) muss der Arbeitgeber vor der Kündigung in der Regel die Zustimmung
 * einer Behörde bzw. des Betriebsrats einholen. Fehlt diese, ist die
 * Kündigung meist unwirksam – das muss aber trotzdem fristgerecht (3
 * Wochen) per Kündigungsschutzklage geltend gemacht werden.
 */
export function sonderkuendigungsschutzHinweis(
  gruende: SonderkuendigungsschutzGruende,
): Hinweis | null {
  const zutreffend: string[] = [];
  if (gruende.schwangerschaftOderElternzeit) zutreffend.push("Schwangerschaft/Elternzeit (§17 MuSchG, §18 BEEG)");
  if (gruende.schwerbehinderung) zutreffend.push("Schwerbehinderung/Gleichstellung (§168 SGB IX)");
  if (gruende.betriebsratsmitglied) zutreffend.push("Betriebsrats-/Personalratsmitgliedschaft (§15 KSchG)");

  if (zutreffend.length === 0) {
    return null;
  }

  return {
    id: "sonderkuendigungsschutz",
    titel: "Möglicher besonderer Kündigungsschutz",
    text:
      `Nach Ihren Angaben könnte besonderer Kündigungsschutz gelten: ${zutreffend.join(", ")}. ` +
      "In diesen Fällen ist vor der Kündigung meist die Zustimmung einer " +
      "Behörde (z. B. Integrationsamt) oder des Betriebsrats nötig. Fehlt " +
      "diese, ist die Kündigung in der Regel unwirksam – das müssen Sie aber " +
      "trotzdem fristgerecht innerhalb von 3 Wochen per Kündigungsschutzklage " +
      "geltend machen, sonst gilt sie automatisch als wirksam. Wir empfehlen " +
      "dringend eine kurzfristige Rechtsberatung (Fachanwalt für Arbeitsrecht " +
      "oder gewerkschaftlicher Rechtsschutz).",
    stufe: "warnung",
  };
}
