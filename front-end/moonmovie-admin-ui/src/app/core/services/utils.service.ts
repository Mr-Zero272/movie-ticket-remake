import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor() {}

    generateDateRangeNext(date: string, n: number = 6) {
        const result = [];
        const currentDate = new Date(date);

        for (let i = 0; i <= n; i++) {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + i);
            result.push(newDate.toISOString().split('T')[0] + 'T00:00:00');
        }

        return result;
    }
}
