import moment from "moment";

export function getTimeLeft(targetTime: string): string | null {
  // Parse target time using today's date
  const now = moment();
  const start = moment(targetTime, "hh:mm A");

  // Make sure the date is today (so we compare hours/minutes)
  start.set({
    year: now.year(),
    month: now.month(),
    date: now.date(),
  });

  const diff = moment.duration(start.diff(now));

  if (diff.asMilliseconds() <= 0) return null;

  const hours = Math.floor(diff.asHours());
  const minutes = diff.minutes();

  let result = "";
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || hours === 0) result += `${minutes}m`;

  return result.trim();
}
