export function daysUntilDate(dueDate: Date): number {
	const today = new Date();
	const due = dueDate;

	// Set the time of both dates to midnight to compare only the dates
	today.setHours(0, 0, 0, 0);
	due.setHours(0, 0, 0, 0);

	// Calculate the difference in milliseconds
	const diffInMs = due.getTime() - today.getTime();

	// Convert milliseconds to days
	const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

	return Math.round(diffInDays); // Handle floating point errors
}

export function isTaskDue(dueDate: string): boolean {
	return daysUntilDate(new Date(dueDate)) <= 0;
}
