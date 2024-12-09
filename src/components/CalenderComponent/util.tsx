/**
 * Get the current week number
 * @param date
 * @returns current week number
 */
export function getCurrentWeekNumber(): number {
	const date = new Date();
	const startOfYear = new Date(date.getFullYear(), 0, 1);
	const days = Math.floor(
		(date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
	);
	const weekNumber = Math.ceil((days + 1) / 7);
	return weekNumber;
}

/**
 * Get the dates in a week
 * @param week
 * @param year
 * @returns dates in a week
 */
export function getDatesInWeek(week: number, year: number) {
	const firstDayOfYear = new Date(year, 0, 1);
	const days = Array.from({ length: 7 }, (_, i) => {
		const day = new Date(firstDayOfYear.getTime());
		day.setDate(firstDayOfYear.getDate() + (week - 1) * 7 + i);
		return day;
	});
	return days;
}

/**
 * Format date to DD-MM-YYYY
 * @param date
 * @returns formatted date
 */
export function formatDate(date: Date) {
	return date.toLocaleDateString("en-GB").replace(/\//g, "-");
}
