'use server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/recommend/keywords';

export const fetchRecommendKeywords = async (query: string) => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');
    try {
        const response = await axios.get<string[]>(`${API_URL}`, {
            params: {
                query,
            },
            headers: {
                Authorization: `Bearer ${token?.value}`,
            },
        });

        const result = response.data;
        return result;
    } catch (error: any) {
        console.error('Error fetching search recommend:', error.message);
        return [];
        // throw new Error('Cannot fetch search recommend keywords');
    }
};

export const fetchHistoryKeywords = async () => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');
    try {
        const response = await axios.get<string[]>(`${API_URL}/history`, {
            headers: {
                Authorization: `Bearer ${token?.value}`,
            },
        });

        const result = response.data;
        return result;
    } catch (error: any) {
        console.error('Error fetching search recommend:', error.message);
        return [];
        // throw new Error('Cannot fetch search recommend keywords');
    }
};
