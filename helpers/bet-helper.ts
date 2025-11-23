export function generateTime(data?: { date: string | Date; time: string }) {
  let date = data?.date ? new Date(data.date) : new Date();

  let list: number[] = [];

  data?.time.split(":").forEach((t) => {
    list.push(Number(t));
  });

  if (list.length >= 2) {
    date.setHours(list[0], list[1] ?? 0);
  }

  return date.toString();
}
