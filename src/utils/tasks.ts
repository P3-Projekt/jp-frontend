function calculateDaysBetween(date1: Date, date2: Date): number {
    const end = date1.getTime();
    const start = date2.getTime();
    
    const msPerDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    return Math.floor((end - start) / msPerDay);
}


export function daysUntilDate(date: Date): number {
    return calculateDaysBetween(date, new Date());
}

export function isTaskDue(dueDate: string): boolean {
    return daysUntilDate(new Date(dueDate)) <= 0;
}
