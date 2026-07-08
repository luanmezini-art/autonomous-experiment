export type Bundesland =
  | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV"
  | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH";

function toDateOnly(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m - 1, d));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/** Gauß'sche Osterformel */
function osterSonntag(jahr: number): Date {
  const k = Math.floor(jahr / 100);
  const m = 15 + Math.floor((3 * k + 3) / 4) - Math.floor((8 * k + 13) / 25);
  const s = 2 - Math.floor((3 * k + 3) / 4);
  const a = jahr % 19;
  const d = (19 * a + m) % 30;
  const r = Math.floor((d + Math.floor(a / 11)) / 29);
  const og = 21 + d - r;
  const sz = 7 - ((jahr + Math.floor(jahr / 4) + s) % 7);
  const oe = 7 - ((og - sz) % 7);
  const osterDatum = og + oe;

  if (osterDatum <= 31) {
    return toDateOnly(jahr, 3, osterDatum);
  }
  return toDateOnly(jahr, 4, osterDatum - 31);
}

/** Mittwoch vor dem 23. November (Buß- und Bettag) */
function bussUndBettag(jahr: number): Date {
  const nov23 = toDateOnly(jahr, 11, 23);
  const wochentag = nov23.getUTCDay(); // 0=So .. 6=Sa
  const diffZumMittwoch = (wochentag - 3 + 7) % 7 || 7;
  return addDays(nov23, -diffZumMittwoch);
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Gesetzliche Feiertage nach Bundesland. Deckt die Rechtslage ab 2023 ab
 * (u.a. Weltkindertag TH seit 2019, Frauentag BE seit 2019 / MV seit 2023).
 * Mariä Himmelfahrt in Bayern gilt genau genommen nur in Gemeinden mit
 * überwiegend katholischer Bevölkerung – hier vereinfacht als landesweit
 * behandelt (konservative Annahme für Fristenberechnung: lieber ein Tag
 * zu viel als zu wenig berücksichtigt).
 */
export function getFeiertage(jahr: number, bundesland: Bundesland): Set<string> {
  const ostern = osterSonntag(jahr);
  const feiertage = new Map<string, Date>();

  feiertage.set("Neujahr", toDateOnly(jahr, 1, 1));
  feiertage.set("Karfreitag", addDays(ostern, -2));
  feiertage.set("Ostermontag", addDays(ostern, 1));
  feiertage.set("Tag der Arbeit", toDateOnly(jahr, 5, 1));
  feiertage.set("Christi Himmelfahrt", addDays(ostern, 39));
  feiertage.set("Pfingstmontag", addDays(ostern, 50));
  feiertage.set("Tag der Deutschen Einheit", toDateOnly(jahr, 10, 3));
  feiertage.set("1. Weihnachtstag", toDateOnly(jahr, 12, 25));
  feiertage.set("2. Weihnachtstag", toDateOnly(jahr, 12, 26));

  const heiligeDreiKoenige: Bundesland[] = ["BW", "BY", "ST"];
  if (heiligeDreiKoenige.includes(bundesland)) {
    feiertage.set("Heilige Drei Könige", toDateOnly(jahr, 1, 6));
  }

  const frauentag: Bundesland[] = ["BE", "MV"];
  if (frauentag.includes(bundesland)) {
    feiertage.set("Internationaler Frauentag", toDateOnly(jahr, 3, 8));
  }

  const fronleichnam: Bundesland[] = ["BW", "BY", "HE", "NW", "RP", "SL"];
  if (fronleichnam.includes(bundesland)) {
    feiertage.set("Fronleichnam", addDays(ostern, 60));
  }

  const mariaeHimmelfahrt: Bundesland[] = ["BY", "SL"];
  if (mariaeHimmelfahrt.includes(bundesland)) {
    feiertage.set("Mariä Himmelfahrt", toDateOnly(jahr, 8, 15));
  }

  if (bundesland === "TH") {
    feiertage.set("Weltkindertag", toDateOnly(jahr, 9, 20));
  }

  const reformationstag: Bundesland[] = ["BB", "MV", "SN", "ST", "TH", "HB", "HH", "NI", "SH"];
  if (reformationstag.includes(bundesland)) {
    feiertage.set("Reformationstag", toDateOnly(jahr, 10, 31));
  }

  const allerheiligen: Bundesland[] = ["BW", "BY", "NW", "RP", "SL"];
  if (allerheiligen.includes(bundesland)) {
    feiertage.set("Allerheiligen", toDateOnly(jahr, 11, 1));
  }

  if (bundesland === "SN") {
    feiertage.set("Buß- und Bettag", bussUndBettag(jahr));
  }

  return new Set([...feiertage.values()].map(dateKey));
}

export function istFeiertag(date: Date, bundesland: Bundesland): boolean {
  const feiertage = getFeiertage(date.getUTCFullYear(), bundesland);
  return feiertage.has(dateKey(date));
}

export function istWochenende(date: Date): boolean {
  const tag = date.getUTCDay();
  return tag === 0 || tag === 6;
}

export function istWerktag(date: Date, bundesland: Bundesland): boolean {
  return !istWochenende(date) && !istFeiertag(date, bundesland);
}

/**
 * §193 BGB: Fällt das Fristende auf einen Sonntag, Samstag oder
 * gesetzlichen Feiertag, verschiebt es sich auf den nächsten Werktag.
 */
export function naechsterWerktagWennNoetig(date: Date, bundesland: Bundesland): Date {
  let result = date;
  while (!istWerktag(result, bundesland)) {
    result = addDays(result, 1);
  }
  return result;
}
