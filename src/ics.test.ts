import { describe, it, expect } from "vitest";
import { fristenAlsIcs } from "./ics";
import type { Frist } from "./fristen";

describe("fristenAlsIcs", () => {
  it("erzeugt ein gültiges VCALENDAR-Grundgerüst mit einem Termin", () => {
    const fristen: Frist[] = [
      {
        id: "test-frist",
        titel: "Testfrist, mit Komma",
        datum: new Date(Date.UTC(2026, 6, 29)),
        erklaerung: "Eine Erklärung.",
        rechtsgrundlage: "§1 TestG",
      },
    ];

    const ics = fristenAlsIcs(fristen);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART;VALUE=DATE:20260729");
    expect(ics).toContain("Testfrist\\, mit Komma");
    expect(ics.endsWith("\r\n")).toBe(true);
  });

  it("erzeugt für mehrere Fristen mehrere VEVENT-Blöcke", () => {
    const fristen: Frist[] = [
      { id: "a", titel: "A", datum: new Date(Date.UTC(2026, 0, 1)), erklaerung: "x", rechtsgrundlage: "y" },
      { id: "b", titel: "B", datum: new Date(Date.UTC(2026, 0, 2)), erklaerung: "x", rechtsgrundlage: "y" },
    ];
    const ics = fristenAlsIcs(fristen);
    expect(ics.match(/BEGIN:VEVENT/g)?.length).toBe(2);
  });
});
