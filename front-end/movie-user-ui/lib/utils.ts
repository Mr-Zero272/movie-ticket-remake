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
