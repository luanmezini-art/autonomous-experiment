export interface FormularDaten {
  zugangsdatum: string;
  bundesland: string;
  beendigungsdatum: string;
  arbeitgeber: string;
  beschaeftigtSeit: string;
  jahresurlaub: string;
  genommeneTage: string;
  betriebsgroesse: string;
  schwangerschaft: boolean;
  schwerbehinderung: boolean;
  betriebsrat: boolean;
}

const STORAGE_KEY = "kuendigungs-cockpit-formular-v1";

/**
 * Speichert die Formulareingaben in der übergebenen Storage (im Betrieb
 * `window.localStorage`), damit sie einen Seiten-Reload überstehen. Es
 * werden bewusst nur Formularfelder gespeichert, keine berechneten
 * Ergebnisse – alles bleibt im Browser, nichts wird an einen Server
 * gesendet.
 */
export function formularSpeichern(daten: FormularDaten, storage: Storage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(daten));
}

/**
 * Lädt zuvor gespeicherte Formulareingaben. Gibt `null` zurück, wenn
 * nichts gespeichert ist oder der gespeicherte Wert nicht mehr zum
 * erwarteten Format passt (z. B. nach einer künftigen Formular-Änderung).
 */
export function formularLaden(storage: Storage): FormularDaten | null {
  const roh = storage.getItem(STORAGE_KEY);
  if (!roh) return null;

  try {
    const daten = JSON.parse(roh);
    if (typeof daten !== "object" || daten === null) return null;
    return daten as FormularDaten;
  } catch {
    return null;
  }
}

export function formularLoeschen(storage: Storage): void {
  storage.removeItem(STORAGE_KEY);
}
