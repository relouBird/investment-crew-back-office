export function generateTime(data?: {
  date?: string | Date;
  time?: string;
}): string {
  const date = data?.date ? new Date(data.date) : new Date();

  // Si un time est fourni → extraire HH:mm[:ss]
  if (data?.time) {
    const [hours, minutes, seconds] = data.time.split(":").map(Number);
    date.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0);
  }

  // Retour timestamptz au format PostgreSQL
  return date.toISOString(); // ex: "2025-11-21T08:52:10.123Z"
}

export function getTimeForDate(dateGetted: Date | string) {
  const date = new Date(dateGetted);

  // Si un time est fourni → extraire HH:mm[:ss]
  let time = String(date.getHours()) + ":" + String(date.getMinutes());

  // Retour timestamptz au format PostgreSQL
  return { date: date.toISOString(), time }; // ex: "2025-11-21T08:52:10.123Z"
}
