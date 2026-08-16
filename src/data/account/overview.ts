import type { SupportedLocale } from "../localization-contract.ts";
import type { SkyBodyPosition } from "../astronomy/sky-strip-positions.ts";

type RuntimeScheduledSession = {
  id: string;
  astrologerName: string;
  astrologerImage: string;
  profileName: string;
  status: string;
  durationMinutes: number;
  requestedStartAt: string;
  scheduledStartAt: string;
  inviteeTimezone: string;
  meetingUrl: string;
};

const validDate = (value: string) => {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

const dateTimeLabel = (
  date: Date,
  locale: SupportedLocale,
  timeZone: string,
) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  try {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(
      date,
    );
  } catch {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
};

const calendarDayValue = (date: Date, timeZone: string) => {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const value = Object.fromEntries(
      parts.map((part) => [part.type, part.value]),
    );
    return Date.UTC(
      Number(value.year),
      Number(value.month) - 1,
      Number(value.day),
    );
  } catch {
    return Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
  }
};

export const prepareAccountSkyOverview = (positions: SkyBodyPosition[]) => {
  const visible = positions.filter((position) =>
    ["sun", "moon", "mercury"].includes(position.id),
  );
  if (visible.length !== 3) return null;
  return visible.map((position) => ({
    id: position.id,
    value: `${position.planetGlyph} ${position.degreeText} ${position.signName}${position.motionText ? " ℞" : ""}`,
  }));
};

export const prepareUpcomingAccountSession = (
  sessions: RuntimeScheduledSession[],
  locale: SupportedLocale,
  now = new Date(),
) => {
  const next = sessions
    .flatMap((session) => {
      const startsAt = validDate(
        session.scheduledStartAt || session.requestedStartAt,
      );
      return session.status === "scheduled" && startsAt && startsAt > now
        ? [{ session, startsAt }]
        : [];
    })
    .sort(
      (left, right) => left.startsAt.getTime() - right.startsAt.getTime(),
    )[0];

  if (!next) return null;
  const days = Math.max(
    0,
    Math.round(
      (calendarDayValue(next.startsAt, next.session.inviteeTimezone) -
        calendarDayValue(now, next.session.inviteeTimezone)) /
        86_400_000,
    ),
  );
  const relative = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(days, "day");

  return {
    id: next.session.id,
    astrologerName: next.session.astrologerName,
    astrologerImage: next.session.astrologerImage,
    profileName: next.session.profileName,
    durationMinutes: next.session.durationMinutes,
    timing: `${relative} · ${dateTimeLabel(
      next.startsAt,
      locale,
      next.session.inviteeTimezone,
    )}`,
    meetingUrl: next.session.meetingUrl,
  };
};

export const prepareAccountOverview = (
  locale: SupportedLocale,
  displayName: string,
  now = new Date(),
  stats: readonly number[] = [3, 4, 2, 12],
) => {
  const hour = now.getHours();
  const greetingKey =
    hour < 12
      ? "account_overview_greeting_morning"
      : hour < 18
        ? "account_overview_greeting_afternoon"
        : "account_overview_greeting_evening";

  return {
    greetingKey,
    firstName: displayName.trim().split(/\s+/)[0] || displayName,
    dateLabel: new Intl.DateTimeFormat(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now),
    stats,
  } as const;
};
