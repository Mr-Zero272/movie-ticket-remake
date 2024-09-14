'use server';
import { SeatDetailSchema } from '@/types/seat';
import axios from 'axios';
import { cookies } from 'next/headers';
import * as z from 'zod';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/seat';
const getSessionToken = () => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    return __sessionToken?.value;
};

export const fetchSeatDetails = async (showingId: number) => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('mmtk');

    try {
        const response = await axios.get(`${API_URL}/seat-detail`, {
            params: {
                showingId,
            },
            headers: { Authorization: 'Bearer ' + __sessionToken?.value },
        });

        const result = z.array(SeatDetailSchema).safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid seat details information');
        }
    } catch (error: any) {
        console.error('Error fetching seat details info:', error.message);
        throw new Error('Cannot fetch seat details information');
    }
};

export const refreshSeatState = async (showingId: number, userId: string) => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('mmtk');

    try {
        await axios.post(
            `${API_URL}/seat-detail/refresh-state`,
            {
                showingId,
                userId,
            },
            {
                params: {
                    showingId,
                },
                headers: { Authorization: 'Bearer ' + __sessionToken?.value },
            },
        );
    } catch (error: any) {
        console.error('Error refresh seat state:', error.message);
        throw new Error('Cannot refresh seat state');
    }
};
