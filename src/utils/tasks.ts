const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

export function taskIsDue(dueDate: string): boolean {
    return new Date(currentDate) >= new Date(dueDate);
}

export function daysUntilDate(date: Date){
    return (date.getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24);
}