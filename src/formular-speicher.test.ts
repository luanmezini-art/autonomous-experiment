import { describe, it, expect } from "vitest";
import { formularSpeichern, formularLaden, formularLoeschen, type FormularDaten } from "./formular-speicher";

function erstelleMockStorage(): Storage {
  const daten = new Map<string, string>();
  return {
    getItem: (key: string) => daten.get(key) ?? null,
    setItem: (key: string, value: string) => {
      daten.set(key, value);
    },
    removeItem: (key: string) => {
      daten.delete(key);
    },
    clear: () => daten.clear(),
    key: () => null,
    get length() {
      return daten.size;
    },
  };
}

const beispielDaten: FormularDaten = {
  zugangsdatum: "2026-07-08",
  bundesland: "NW",
  beendigungsdatum: "2026-09-15",
  arbeitgeber: "Musterfirma GmbH",
  beschaeftigtSeit: "2020-01-01",
  jahresurlaub: "24",
  genommeneTage: "10",
  betriebsgroesse: "ueber10",
  schwangerschaft: false,
  schwerbehinderung: false,
  betriebsrat: false,
};

describe("formularSpeichern/formularLaden", () => {
  it("lädt zuvor gespeicherte Daten unverändert zurück", () => {
    const storage = erstelleMockStorage();
    formularSpeichern(beispielDaten, storage);
    expect(formularLaden(storage)).toEqual(beispielDaten);
  });

  it("gibt null zurück, wenn nichts gespeichert ist", () => {
    const storage = erstelleMockStorage();
    expect(formularLaden(storage)).toBeNull();
  });

  it("gibt null zurück, wenn der gespeicherte Wert kein valides JSON ist", () => {
    const storage = erstelleMockStorage();
    storage.setItem("kuendigungs-cockpit-formular-v1", "{kaputt");
    expect(formularLaden(storage)).toBeNull();
  });
});

describe("formularLoeschen", () => {
  it("entfernt gespeicherte Daten", () => {
    const storage = erstelleMockStorage();
    formularSpeichern(beispielDaten, storage);
    formularLoeschen(storage);
    expect(formularLaden(storage)).toBeNull();
  });
});
