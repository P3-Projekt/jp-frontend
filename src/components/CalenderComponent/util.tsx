/**
 * Get the current week number
 * @param date
 * @returns current week number
 */
export function getCurrentWeekNumber(date: Date): number {
	const msPerDay = 86400000;

	const firstThursday: Date = new Date(date.getFullYear(), 0, 1);

	while (firstThursday.getDay() !== 4) {
		firstThursday.setDate(firstThursday.getDate() + 1);
	}

	const currentThursday: Date = new Date(date);

	while (currentThursday.getDay() !== 4) {
		currentThursday.setDate(currentThursday.getDate() - 1);
	}

	return Math.ceil(
		((currentThursday.getTime() - firstThursday.getTime()) / msPerDay + 1) / 7,
	);
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
