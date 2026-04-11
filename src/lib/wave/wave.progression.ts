import { WaveProgression } from "./wave.types";

const JOURNEY_TOTAL_WEEKS = 10;
const DAYS_PER_WEEK = 7;
const TOTAL_JOURNEY_DAYS = JOURNEY_TOTAL_WEEKS * DAYS_PER_WEEK;

type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0 = Sun ... 6 = Sat
};

function weekdayToIndex(weekday: string): number {
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const value = map[weekday];
  if (value === undefined) {
    throw new Error(`Unsupported weekday value: ${weekday}`);
  }

  return value;
}

function getZonedDateParts(date: Date, timezone: string): ZonedDateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  const weekdayText = parts.find((p) => p.type === "weekday")?.value ?? "";

  return {
    year,
    month,
    day,
    weekday: weekdayToIndex(weekdayText),
  };
}

function getTimeZoneOffsetMs(date: Date, timezone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  const minute = Number(parts.find((p) => p.type === "minute")?.value);
  const second = Number(parts.find((p) => p.type === "second")?.value);

  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  return asUtc - date.getTime();
}

function zonedMidnightUtc(
  year: number,
  month: number,
  day: number,
  timezone: string
): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const offsetMs = getTimeZoneOffsetMs(utcGuess, timezone);
  return new Date(utcGuess.getTime() - offsetMs);
}

function toZonedCalendarDate(date: Date, timezone: string): Date {
  const parts = getZonedDateParts(date, timezone);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

function differenceInCalendarDaysSafe(later: Date, earlier: Date): number {
  return Math.floor(
    (later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24)
  );
}

// Always return the NEXT Thursday in the Wave timezone.
export function getNextThursdayStartDate(
  now: Date = new Date(),
  timezone: string = "Africa/Johannesburg"
): Date {
  const current = getZonedDateParts(now, timezone);
  const THURSDAY = 4;

  let daysUntilThursday = THURSDAY - current.weekday;
  if (daysUntilThursday <= 0) {
    daysUntilThursday += 7;
  }

  const calendarDate = new Date(
    Date.UTC(current.year, current.month - 1, current.day)
  );
  calendarDate.setUTCDate(calendarDate.getUTCDate() + daysUntilThursday);

  const targetYear = calendarDate.getUTCFullYear();
  const targetMonth = calendarDate.getUTCMonth() + 1;
  const targetDay = calendarDate.getUTCDate();

  return zonedMidnightUtc(targetYear, targetMonth, targetDay, timezone);
}

export function getWaveProgression(
  startsAt: Date,
  now: Date = new Date(),
  timezone: string = "Africa/Johannesburg"
): WaveProgression {
  const start = toZonedCalendarDate(startsAt, timezone);
  const today = toZonedCalendarDate(now, timezone);

  if (today.getTime() < start.getTime()) {
    return {
      phase: "PRE_WAVE",
      weekNumber: null,
      dayNumber: null,
      elapsedDays: null,
      startsAt,
    };
  }

  const elapsedDays = differenceInCalendarDaysSafe(today, start);

  if (elapsedDays >= TOTAL_JOURNEY_DAYS) {
    return {
      phase: "COMPLETED",
      weekNumber: null,
      dayNumber: null,
      elapsedDays,
      startsAt,
    };
  }

  const weekNumber = Math.floor(elapsedDays / DAYS_PER_WEEK) + 1;
  const dayNumber = (elapsedDays % DAYS_PER_WEEK) + 1;
  const phase = weekNumber >= 9 ? "INTEGRATION" : "CORE";

  return {
    phase,
    weekNumber,
    dayNumber,
    elapsedDays,
    startsAt,
  };
}