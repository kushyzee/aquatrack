import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(num: number) {
  return num.toLocaleString();
}

export function formatCurrency(num: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function toFieldErrors(errors: unknown): { message: string }[] {
  if (!Array.isArray(errors)) return [];
  return errors
    .map((e) => (typeof e === "string" ? e : e?.message))
    .filter((message): message is string => Boolean(message))
    .map((message) => ({ message }));
}
