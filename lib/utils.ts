import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {               // path es la ruta relativa dentro la aplicación (dev = "/shop")
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;     
}

