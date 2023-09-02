import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Show } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ERR = {
  unauthenticated: "Unauthenticated",
  unauthorized: "Unauthorized",
  db: "Failed to find in database",
  undefined: "Undefined variable",
  fetch: "Failed to fetch data",
  not_allowed: "User should not be allowed to do this action",
}

export function pickRandomShow(shows: Show[]) {
  const show = shows[Math.floor(Math.random() * shows.length)]
  if (show) return show
  else throw new Error(ERR.undefined)
}
