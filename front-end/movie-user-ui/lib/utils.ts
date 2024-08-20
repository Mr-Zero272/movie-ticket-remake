import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// created by chatgpt
export function isBase64Image(imageData: string) {
    const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData);
}

// get time ago
export function timeAgo(date: string) {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

export function formatCurrencyUSD(currency: number) {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return USDollar.format(currency);
}

export function formatCurrencyVND(currency: number) {
    let USDollar = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return USDollar.format(currency);
}

export const generateDateRangeNext = (date: string, n: number = 6) => {
    const result = [];
    const currentDate = new Date(date);

    for (let i = 0; i <= n; i++) {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + i);
        result.push(newDate.toISOString().split('T')[0] + 'T00:00:00');
    }

    return result;
};
