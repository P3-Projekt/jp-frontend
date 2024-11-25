import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names and tailwind classes
 * @param inputs
 * @returns {string} - Combined class names
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
