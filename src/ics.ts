import type { Frist } from "./fristen";

function formatDateForIcs(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function foldLine(line: string): string {
  // RFC 5545: Zeilen sollen nach 75 Oktetten umgebrochen werden.
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    parts.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  parts.push(rest);
  return parts.join("\r\n");
}

function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export function fristenAlsIcs(fristen: Frist[]): string {
  const now = formatDateForIcs(new Date());
  const zeilen: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kuendigungs-Cockpit//DE",
    "CALSCALE:GREGORIAN",
  ];

  for (const frist of fristen) {
    const datum = formatDateForIcs(frist.datum);
    zeilen.push(
      "BEGIN:VEVENT",
      `UID:${frist.id}-${datum}@kuendigungs-cockpit`,
      `DTSTAMP:${now}T000000Z`,
      `DTSTART;VALUE=DATE:${datum}`,
      `SUMMARY:${escapeText(frist.titel)}`,
      `DESCRIPTION:${escapeText(`${frist.erklaerung} (${frist.rechtsgrundlage})`)}`,
      "END:VEVENT",
    );
  }

  zeilen.push("END:VCALENDAR");
  return zeilen.map(foldLine).join("\r\n") + "\r\n";
}
