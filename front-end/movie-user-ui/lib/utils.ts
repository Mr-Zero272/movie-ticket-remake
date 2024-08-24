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

export const paginate = ({ current, max }: { current: number; max: number }) => {
    let items: (string | number)[] = [1];

    let prev = current === 1 ? null : current - 1;
    let next = current === max ? null : current + 1;

    if (current === 1 && max === 1) return { current, prev, next, items };
    if (current > 4) items.push('…');

    let r = 2,
        r1 = current - r,
        r2 = current + r;

    for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i);

    if (r2 + 1 < max) items.push('…');
    if (r2 < max) items.push(max);

    return { current, prev, next, items };
};
