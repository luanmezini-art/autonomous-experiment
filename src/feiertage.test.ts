import { describe, it, expect } from "vitest";
import { getFeiertage, istWerktag, naechsterWerktagWennNoetig } from "./feiertage";

function d(y: number, m: number, day: number): Date {
  return new Date(Date.UTC(y, m - 1, day));
}

describe("getFeiertage", () => {
  it("berechnet Ostern 2026 korrekt (Ostersonntag 5. April 2026)", () => {
    const feiertage = getFeiertage(2026, "NW");
    expect(feiertage.has("2026-04-03")).toBe(true); // Karfreitag
    expect(feiertage.has("2026-04-06")).toBe(true); // Ostermontag
  });

  it("kennt Fronleichnam nur in katholisch geprägten Bundesländern", () => {
    const nrw = getFeiertage(2026, "NW");
    const berlin = getFeiertage(2026, "BE");
    expect(nrw.has("2026-06-04")).toBe(true);
    expect(berlin.has("2026-06-04")).toBe(false);
  });

  it("kennt Reformationstag in Sachsen aber nicht in Bayern", () => {
    expect(getFeiertage(2026, "SN").has("2026-10-31")).toBe(true);
    expect(getFeiertage(2026, "BY").has("2026-10-31")).toBe(false);
  });

  it("berechnet den Buß- und Bettag in Sachsen (Mittwoch vor dem 23. November)", () => {
    const sachsen = getFeiertage(2026, "SN");
    expect(sachsen.has("2026-11-18")).toBe(true);
  });
});

describe("istWerktag", () => {
  it("erkennt Samstag/Sonntag als keinen Werktag", () => {
    expect(istWerktag(d(2026, 7, 11), "NW")).toBe(false); // Samstag
    expect(istWerktag(d(2026, 7, 12), "NW")).toBe(false); // Sonntag
  });

  it("erkennt einen normalen Wochentag als Werktag", () => {
    expect(istWerktag(d(2026, 7, 8), "NW")).toBe(true); // Mittwoch
  });
});

describe("naechsterWerktagWennNoetig", () => {
  it("verschiebt einen Feiertag auf den nächsten Werktag", () => {
    const result = naechsterWerktagWennNoetig(d(2026, 10, 3), "NW"); // Tag der Deutschen Einheit, Samstag 2026
    expect(result.getUTCDate()).toBe(5); // Montag 5.10.2026
  });

  it("lässt einen normalen Werktag unverändert", () => {
    const result = naechsterWerktagWennNoetig(d(2026, 7, 8), "NW");
    expect(result.toISOString().slice(0, 10)).toBe("2026-07-08");
  });
});
