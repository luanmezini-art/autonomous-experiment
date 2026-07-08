import { describe, it, expect } from "vitest";
import { betriebsgroesseHinweis, sonderkuendigungsschutzHinweis } from "./hinweise";

describe("betriebsgroesseHinweis", () => {
  it("gibt keinen Hinweis aus, wenn der Betrieb mehr als 10 Beschäftigte hat", () => {
    expect(betriebsgroesseHinweis("ueber10")).toBeNull();
  });

  it("warnt bei Kleinbetrieb, dass der allgemeine Kündigungsschutz meist nicht gilt", () => {
    const hinweis = betriebsgroesseHinweis("bis10");
    expect(hinweis).not.toBeNull();
    expect(hinweis?.stufe).toBe("info");
    expect(hinweis?.text).toMatch(/Kündigungsschutzgesetz/);
  });

  it("weist bei unklarer Betriebsgröße auf die Zählweise hin", () => {
    const hinweis = betriebsgroesseHinweis("unklar");
    expect(hinweis).not.toBeNull();
    expect(hinweis?.id).toBe("betriebsgroesse-unklar");
  });
});

describe("sonderkuendigungsschutzHinweis", () => {
  it("gibt keinen Hinweis aus, wenn kein Grund zutrifft", () => {
    const hinweis = sonderkuendigungsschutzHinweis({
      schwangerschaftOderElternzeit: false,
      schwerbehinderung: false,
      betriebsratsmitglied: false,
    });
    expect(hinweis).toBeNull();
  });

  it("warnt bei Schwangerschaft/Elternzeit mit hoher Dringlichkeit", () => {
    const hinweis = sonderkuendigungsschutzHinweis({
      schwangerschaftOderElternzeit: true,
      schwerbehinderung: false,
      betriebsratsmitglied: false,
    });
    expect(hinweis?.stufe).toBe("warnung");
    expect(hinweis?.text).toMatch(/Schwangerschaft\/Elternzeit/);
    expect(hinweis?.text).not.toMatch(/Schwerbehinderung\/Gleichstellung/);
  });

  it("listet mehrere zutreffende Gründe gemeinsam auf", () => {
    const hinweis = sonderkuendigungsschutzHinweis({
      schwangerschaftOderElternzeit: false,
      schwerbehinderung: true,
      betriebsratsmitglied: true,
    });
    expect(hinweis?.text).toMatch(/Schwerbehinderung\/Gleichstellung/);
    expect(hinweis?.text).toMatch(/Betriebsrats-\/Personalratsmitgliedschaft/);
  });
});
