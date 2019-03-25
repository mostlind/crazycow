import { Amount } from "./Amount";

export interface Time {
  hours: number;
  minutes: number;
}

export const twentyFourToTwelve = (hours: number) =>
  hours === 0 ? 12 : ((hours - 1) % 12) + 1;

export function formatTime({ hours, minutes }: Time) {
  const amPm = hours >= 12 ? "pm" : "am";

  const displayMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${twentyFourToTwelve(hours)}:${displayMinutes}${amPm}`;
}

export interface Meal {
  id: number;
  time: Time;
  amount: Amount;
  notes: string;
}

export interface MealFields {
  time: Time;
  amount: Amount;
  notes: string;
}
