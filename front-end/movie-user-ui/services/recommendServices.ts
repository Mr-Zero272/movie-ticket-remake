'use server';
import { Keyword } from '@/types/keyword';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/recommend/keywords';

export const fetchRecommendKeywords = async (query: string, histories: Keyword[]): Promise<Array<Keyword>> => {
    try {
        const rawRes = await fetch(
            `${API_URL}?` +
                new URLSearchParams({
                    query,
                }).toString(),
        );

        if (!rawRes.ok) {
            throw new Error(`Server error: ${rawRes.statusText}`);
        }

        let result = (await rawRes.json()) as Array<string>;
        // add current keyword
        result = [query, ...result];

        // filter unique keywords
        result = Array.from(new Set(result));

        let uniqueResults = result.map((k) => ({ keyword: k, isHistory: false }));
        histories = histories.filter((h) => h.keyword.toLowerCase().includes(query.toLowerCase()));
        uniqueResults = [...histories, ...uniqueResults];

        const returnValues = uniqueResults.filter(
            (obj, index, self) => index === self.findIndex((o) => o.keyword === obj.keyword),
        );

        return returnValues.slice(0, 8);
    } catch (error: any) {
        console.error('Error fetching search recommend:', error.message);
        return [];
        // throw new Error('Cannot fetch search recommend keywords');
    }
};

export const addHistoryKeyword = async (searchKeyword: string) => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');
    if (!token) return [];

    try {
        const res = await axios.post<string>(
            `${API_URL}`,
            {
                searchKeyword,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                },
            },
        );
        return res.data;
    } catch (error: any) {
        console.error('Error fetching search recommend:', error.message);
        // throw new Error('Cannot fetch search recommend keywords');
    }
};

export const fetchHistoryKeywords = async (): Promise<Array<Keyword>> => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');
    if (!token) return [];
    try {
        const response = await axios.get<string[]>(`${API_URL}/history`, {
            headers: {
                Authorization: `Bearer ${token?.value}`,
            },
        });

        const result = response.data;
        return result.map((k) => ({ keyword: k, isHistory: true }));
    } catch (error: any) {
        console.error('Error fetching search recommend:', error.message);
        return [];
        // throw new Error('Cannot fetch search recommend keywords');
    }
};
