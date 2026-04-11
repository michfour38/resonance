const PREWAVE_TIMEZONE = "Africa/Johannesburg";

export function getPreWaveQuestions() {
  return [
    "What do you feel you are currently seeking in connection?",
    "What do you believe others experience when they meet you?",
    "Where do you feel most misunderstood in your relationships?",
    "What do you tend to protect or hide early on?",
    "What kind of connection feels safe to you?",
    "What are you quietly hoping will change through this journey?",
  ];
}

function getDatePartsInTimezone(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return { year, month, day };
}

function dayNumberInTimezone(date: Date, timeZone: string) {
  const { year, month, day } = getDatePartsInTimezone(date, timeZone);
  return Date.UTC(year, month - 1, day) / 86400000;
}

export function getPreWaveStartDate(
  waveStart: Date,
  _timeZone: string = PREWAVE_TIMEZONE
) {
  const d = new Date(waveStart);
  d.setUTCDate(d.getUTCDate() - 6); // Friday before Thursday wave start
  return d;
}

export function getUnlockedPreWaveCount(
  waveStart: Date,
  now: Date = new Date(),
  timeZone: string = PREWAVE_TIMEZONE
): number {
  const releaseStart = getPreWaveStartDate(waveStart, timeZone);

  const releaseDayNumber = dayNumberInTimezone(releaseStart, timeZone);
  const todayDayNumber = dayNumberInTimezone(now, timeZone);

  const diff = todayDayNumber - releaseDayNumber + 1;

  return Math.max(0, Math.min(6, diff));
}