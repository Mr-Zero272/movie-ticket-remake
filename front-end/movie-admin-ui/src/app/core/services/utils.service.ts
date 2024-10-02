import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor() {}

    generateDateRangeNext(date: string, n: number = 6) {
        const result = [];
        const currentDate = new Date(date);

        for (let i = n; i > 0; i--) {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - i);
            result.push(newDate.toISOString().split('T')[0] + 'T00:00:00');
        }

        for (let i = 0; i <= n; i++) {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + i);
            result.push(newDate.toISOString().split('T')[0] + 'T00:00:00');
        }

        return result;
    }

    getDaysInMonth(year: number, month: number) {
        // Create an array to hold the days
        let days = [];

        // Note: JavaScript months are 0-indexed (0 = January, 1 = February, ..., 11 = December)
        // So, we need to subtract 1 from the input month to get the correct month in JS Date object
        month = month - 1;

        // Get the number of days in the month
        let date = new Date(year, month + 1, 0); // Sets date to the last day of the month
        let numDays = date.getDate(); // Returns the last day of the month as a number

        // Loop through all days of the month
        for (let day = 2; day <= numDays + 1; day++) {
            // Create a date object for each day
            let dateString = new Date(year, month, day).toISOString().slice(0, 10);
            days.push(dateString + 'T00:00:00');
        }

        // Join the array into a string with a comma separator
        return days;
    }
}
