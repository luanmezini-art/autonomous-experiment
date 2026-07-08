import { type Bundesland, naechsterWerktagWennNoetig } from "./feiertage";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/** Addiert Monate, wobei ein Tag, den der Zielmonat nicht hat (z.B. 31. in
 * einem 30-Tage-Monat), auf den letzten Tag des Zielmonats begrenzt wird. */
function addMonths(date: Date, months: number): Date {
  const tag = date.getUTCDate();
  const result = new Date(date);
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const tageImZielmonat = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(tag, tageImZielmonat));
  return result;
}

export interface Frist {
  id: string;
  titel: string;
  datum: Date;
  erklaerung: string;
  rechtsgrundlage: string;
}

/**
 * §4 KSchG: Klage binnen drei Wochen nach Zugang der schriftlichen Kündigung.
 * Fristbeginn ist der Tag nach dem Zugang (§187 Abs. 1 BGB), Fristende drei
 * Wochen später (§188 Abs. 2 BGB) – rechnerisch also Zugangsdatum + 21 Tage.
 * Fällt das Ende auf Wochenende/Feiertag, verschiebt es sich nach §193 BGB
 * auf den nächsten Werktag.
 */
export function kuendigungsschutzklageFrist(
  zugangDatum: Date,
  bundesland: Bundesland,
): Frist {
  const rechnerischesEnde = addDays(zugangDatum, 21);
  const datum = naechsterWerktagWennNoetig(rechnerischesEnde, bundesland);
  return {
    id: "kuendigungsschutzklage",
    titel: "Frist für die Kündigungsschutzklage",
    datum,
    erklaerung:
      "Bis zu diesem Tag muss die Kündigungsschutzklage beim Arbeitsgericht " +
      "eingegangen sein – nicht nur abgeschickt. Diese Frist gilt unabhängig " +
      "davon, ob die Kündigung wirksam ist oder nicht.",
    rechtsgrundlage: "§4 KSchG, §187, §188, §193 BGB",
  };
}

/**
 * §38 Abs. 1 SGB III: Meldepflicht "arbeitssuchend" (nicht "arbeitslos").
 * Wer mindestens drei Monate vor dem Ende des Beschäftigungsverhältnisses
 * von dessen Beendigung weiß, muss sich spätestens drei Monate vorher
 * melden. Bei kürzerem Vorlauf gilt: Meldung innerhalb von drei Tagen nach
 * Kenntnis des Beendigungszeitpunkts. Versäumnis kann zu einer einwöchigen
 * Sperrzeit beim Arbeitslosengeld führen.
 */
export function arbeitsagenturMeldefrist(
  kenntnisDatum: Date,
  beendigungsDatum: Date,
): Frist {
  const dreiMonateVorher = addMonths(beendigungsDatum, -3);
  const mehrAlsDreiMonateVorlauf = kenntnisDatum.getTime() < dreiMonateVorher.getTime();

  const datum = mehrAlsDreiMonateVorlauf ? dreiMonateVorher : addDays(kenntnisDatum, 3);

  return {
    id: "arbeitsagentur-meldung",
    titel: "Arbeitssuchend melden bei der Agentur für Arbeit",
    datum,
    erklaerung: mehrAlsDreiMonateVorlauf
      ? "Da mehr als drei Monate zwischen der Kenntnis und dem Ende des " +
        "Arbeitsverhältnisses liegen, muss die Meldung spätestens drei " +
        "Monate vor Beendigung erfolgen."
      : "Da weniger als drei Monate zwischen Kenntnis und Beendigung " +
        "liegen, muss die Meldung innerhalb von drei Tagen nach Kenntnis " +
        "des Beendigungszeitpunkts erfolgen. Wird diese Frist versäumt, " +
        "droht eine einwöchige Sperrzeit beim Arbeitslosengeld.",
    rechtsgrundlage: "§38 Abs. 1 SGB III, §159 SGB III",
  };
}

export interface ResturlaubEingabe {
  jahresurlaubstage: number;
  bereitsGenommeneTage: number;
  beschaeftigtSeit: Date;
  beendigungsDatum: Date;
}

export interface ResturlaubErgebnis {
  anspruchImJahr: number;
  resturlaubstage: number;
  regel: "zwoelftelung" | "voller_anspruch";
  erklaerung: string;
}

function vollständigeMonateZwischen(start: Date, ende: Date): number {
  let monate =
    (ende.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (ende.getUTCMonth() - start.getUTCMonth());

  if (ende.getUTCDate() < start.getUTCDate()) {
    monate -= 1;
  }

  return Math.max(0, monate);
}

function vollständigeMonateImJahr(beschaeftigtSeit: Date, beendigungsDatum: Date): number {
  const jahr = beendigungsDatum.getUTCFullYear();
  const jahresbeginn = new Date(Date.UTC(jahr, 0, 1));
  const start = beschaeftigtSeit.getTime() > jahresbeginn.getTime() ? beschaeftigtSeit : jahresbeginn;
  return vollständigeMonateZwischen(start, beendigungsDatum);
}

/**
 * Vereinfachte Berechnung nach §4/§5 BUrlG für den Standardfall (5-Tage-
 * Woche, keine tarifvertraglichen Sonderregeln). Die Wartezeit (6 Monate
 * ununterbrochenes Bestehen des Arbeitsverhältnisses, §4 BUrlG) muss
 * erfüllt UND das Ausscheiden muss nach dem 30. Juni liegen, damit der
 * volle Jahresurlaub zusteht (§5 Abs. 1 BUrlG e contrario). Ist die
 * Wartezeit nicht erfüllt oder erfolgt das Ausscheiden bis zum 30. Juni,
 * gilt die Zwölftelungsregel: 1/12 des Jahresurlaubs je vollem
 * Beschäftigungsmonat im Beendigungsjahr. Bruchteile ab einem halben Tag
 * werden aufgerundet (§5 Abs. 2 BUrlG). Diese Berechnung ersetzt keine
 * Rechtsberatung im Einzelfall (z. B. bei Tarifverträgen oder
 * abweichenden Betriebsvereinbarungen).
 */
export function resturlaubBerechnen(eingabe: ResturlaubEingabe): ResturlaubErgebnis {
  const { jahresurlaubstage, bereitsGenommeneTage, beschaeftigtSeit, beendigungsDatum } = eingabe;

  const jahr = beendigungsDatum.getUTCFullYear();
  const dreissigsterJuni = new Date(Date.UTC(jahr, 5, 30));
  const wartezeitErfuellt = vollständigeMonateZwischen(beschaeftigtSeit, beendigungsDatum) >= 6;
  const nachDreissigstemJuni = beendigungsDatum.getTime() > dreissigsterJuni.getTime();

  if (wartezeitErfuellt && nachDreissigstemJuni) {
    const resturlaubstage = Math.max(0, jahresurlaubstage - bereitsGenommeneTage);
    return {
      anspruchImJahr: jahresurlaubstage,
      resturlaubstage,
      regel: "voller_anspruch",
      erklaerung:
        "Die Wartezeit von 6 Monaten ist erfüllt und das Arbeitsverhältnis " +
        "endet nach dem 30. Juni – es besteht Anspruch auf den vollen " +
        "Jahresurlaub, abzüglich bereits genommener Tage.",
    };
  }

  const monate = vollständigeMonateImJahr(beschaeftigtSeit, beendigungsDatum);
  const anteiligerAnspruch = (jahresurlaubstage * monate) / 12;
  const bruchteil = anteiligerAnspruch - Math.floor(anteiligerAnspruch);
  const aufgerundet = bruchteil >= 0.5 ? Math.ceil(anteiligerAnspruch) : Math.floor(anteiligerAnspruch);
  const resturlaubstage = Math.max(0, aufgerundet - bereitsGenommeneTage);

  return {
    anspruchImJahr: aufgerundet,
    resturlaubstage,
    regel: "zwoelftelung",
    erklaerung:
      `Für ${monate} volle Beschäftigungsmonate im Beendigungsjahr besteht ein ` +
      `anteiliger Anspruch von ${aufgerundet} von ${jahresurlaubstage} Urlaubstagen ` +
      "(Zwölftelungsregel, §5 BUrlG), abzüglich bereits genommener Tage.",
  };
}
