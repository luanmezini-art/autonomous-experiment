import { describe, it, expect } from "vitest";
import {
  kuendigungsschutzklageFrist,
  arbeitsagenturMeldefrist,
  resturlaubBerechnen,
} from "./fristen";

function d(y: number, m: number, day: number): Date {
  return new Date(Date.UTC(y, m - 1, day));
}

describe("kuendigungsschutzklageFrist", () => {
  it("berechnet 3 Wochen nach Zugang ohne Verschiebung", () => {
    // Zugang Mittwoch 8.7.2026 -> +21 Tage = Mittwoch 29.7.2026 (Werktag)
    const frist = kuendigungsschutzklageFrist(d(2026, 7, 8), "NW");
    expect(frist.datum.toISOString().slice(0, 10)).toBe("2026-07-29");
  });

  it("verschiebt die Frist, wenn sie auf ein Wochenende fällt", () => {
    // Zugang Samstag 27.6.2026 -> rechnerisch +21 Tage = Samstag 18.7.2026 -> Montag 20.7.2026
    const frist = kuendigungsschutzklageFrist(d(2026, 6, 27), "NW");
    expect(frist.datum.toISOString().slice(0, 10)).toBe("2026-07-20");
  });
});

describe("arbeitsagenturMeldefrist", () => {
  it("verlangt Meldung 3 Monate vor Beendigung bei langem Vorlauf", () => {
    const kenntnis = d(2026, 1, 1);
    const beendigung = d(2026, 12, 31);
    const frist = arbeitsagenturMeldefrist(kenntnis, beendigung);
    expect(frist.datum.toISOString().slice(0, 10)).toBe("2026-09-30");
  });

  it("verlangt Meldung 3 Tage nach Kenntnis bei kurzem Vorlauf", () => {
    const kenntnis = d(2026, 7, 8);
    const beendigung = d(2026, 7, 31);
    const frist = arbeitsagenturMeldefrist(kenntnis, beendigung);
    expect(frist.datum.toISOString().slice(0, 10)).toBe("2026-07-11");
  });
});

describe("resturlaubBerechnen", () => {
  it("wendet die Zwölftelungsregel an, wenn die Wartezeit trotz Ausscheiden nach dem 30. Juni nicht erfüllt ist", () => {
    // Beschäftigt seit 1.4.2026, Ende 31.8.2026 -> nur 4 volle Monate Betriebszugehörigkeit, Wartezeit (6 Monate) nicht erfüllt
    const ergebnis = resturlaubBerechnen({
      jahresurlaubstage: 24,
      bereitsGenommeneTage: 2,
      beschaeftigtSeit: d(2026, 4, 1),
      beendigungsDatum: d(2026, 8, 31),
    });
    expect(ergebnis.regel).toBe("zwoelftelung");
    expect(ergebnis.anspruchImJahr).toBe(8); // 24 * 4/12 = 8
    expect(ergebnis.resturlaubstage).toBe(6);
  });

  it("gewährt vollen Jahresanspruch bei erfüllter Wartezeit und Ausscheiden nach dem 30. Juni", () => {
    const ergebnis = resturlaubBerechnen({
      jahresurlaubstage: 24,
      bereitsGenommeneTage: 10,
      beschaeftigtSeit: d(2020, 1, 1),
      beendigungsDatum: d(2026, 9, 15),
    });
    expect(ergebnis.regel).toBe("voller_anspruch");
    expect(ergebnis.resturlaubstage).toBe(14);
  });

  it("wendet trotz erfüllter Wartezeit die Zwölftelungsregel an, wenn das Ausscheiden bis zum 30. Juni erfolgt", () => {
    const ergebnis = resturlaubBerechnen({
      jahresurlaubstage: 26,
      bereitsGenommeneTage: 3,
      beschaeftigtSeit: d(2020, 1, 1),
      beendigungsDatum: d(2026, 6, 30),
    });
    // 26 * 5/12 = 10.833 -> aufrunden auf 11 (Bruchteil >= 0.5)
    expect(ergebnis.regel).toBe("zwoelftelung");
    expect(ergebnis.anspruchImJahr).toBe(11);
    expect(ergebnis.resturlaubstage).toBe(8);
  });

  it("rundet Bruchteile unter einem halben Tag ab", () => {
    // 20 * 2/12 = 3.333 -> abrunden auf 3
    const ergebnis = resturlaubBerechnen({
      jahresurlaubstage: 20,
      bereitsGenommeneTage: 1,
      beschaeftigtSeit: d(2026, 1, 1),
      beendigungsDatum: d(2026, 3, 31),
    });
    expect(ergebnis.anspruchImJahr).toBe(3);
    expect(ergebnis.resturlaubstage).toBe(2);
  });
});
