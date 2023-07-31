import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function raise(err: string): never {
  throw new Error(err)
}

export const ERR = {
  unauthenticated: "Unauthenticated",
  unauthorized: "Unauthorized",
  db: "Failed to find in database",
  undefined: "Undefined variable",
  fetch: "Failed to fetch data",
}
