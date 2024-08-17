import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LockPeriod {
  value: string;
  label: string;
}
export const lockPeriods: LockPeriod[] = [
  { value: "0", label: "2 Min" },
  { value: "1", label: "3 Min" },
  { value: "2", label: "5 Min" },
  { value: "3", label: "7 Min" },
  { value: "4", label: "10 Min" },
];
