import { addMinutes, differenceInSeconds } from "date-fns";

export function calcTimeRemaining(timestamp: Date, timer: number): number {
  const now = new Date();
  const start = new Date(timestamp);
  const end = addMinutes(start, timer);

  const remaining = differenceInSeconds(end, now);

  return remaining >= 0 ? remaining : 0;
}

export default calcTimeRemaining;
