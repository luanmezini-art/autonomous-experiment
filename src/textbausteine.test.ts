import { describe, it, expect } from "vitest";
import { anwaltsanfrageText, arbeitsagenturZusammenfassungText } from "./textbausteine";

function d(y: number, m: number, day: number): Date {
  return new Date(Date.UTC(y, m - 1, day));
}

describe("anwaltsanfrageText", () => {
  it("enthält die formatierten Daten und den Arbeitgebernamen", () => {
    const text = anwaltsanfrageText({
      arbeitgeber: "Musterfirma GmbH",
      zugangsdatum: d(2026, 7, 8),
      klagefristDatum: d(2026, 7, 29),
      letzterArbeitstag: d(2026, 9, 15),
    });
    expect(text).toContain("08.07.2026");
    expect(text).toContain("29.07.2026");
    expect(text).toContain("15.09.2026");
    expect(text).toContain("Musterfirma GmbH");
    expect(text).toContain("[Ihr Name]");
  });

  it("verwendet einen generischen Platzhalter, wenn kein Arbeitgeber angegeben ist", () => {
    const text = anwaltsanfrageText({
      arbeitgeber: "",
      zugangsdatum: d(2026, 7, 8),
      klagefristDatum: d(2026, 7, 29),
      letzterArbeitstag: d(2026, 9, 15),
    });
    expect(text).toContain("meinem Arbeitgeber");
  });
});

describe("arbeitsagenturZusammenfassungText", () => {
  it("listet die Kerndaten für die Meldung auf", () => {
    const text = arbeitsagenturZusammenfassungText({
      arbeitgeber: "Musterfirma GmbH",
      zugangsdatum: d(2026, 7, 8),
      klagefristDatum: d(2026, 7, 29),
      letzterArbeitstag: d(2026, 9, 15),
    });
    expect(text).toContain("08.07.2026");
    expect(text).toContain("15.09.2026");
    expect(text).toContain("Musterfirma GmbH");
  });

  it("verwendet einen Platzhalter, wenn kein Arbeitgeber angegeben ist", () => {
    const text = arbeitsagenturZusammenfassungText({
      arbeitgeber: "   ",
      zugangsdatum: d(2026, 7, 8),
      klagefristDatum: d(2026, 7, 29),
      letzterArbeitstag: d(2026, 9, 15),
    });
    expect(text).toContain("[Name des Arbeitgebers]");
  });
});
