'use server';
import { FavoriteMovieDtosSchema } from '@/types/movie';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { z } from 'zod';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie/favorite';

const getSessionToken = () => {
    const cookieStore = cookies();
    const mmtkToken = cookieStore.get('mmtk');

    return mmtkToken?.value;
};

export const addToFavorite = async ({ movieId, userId }: { movieId: number; userId: string }) => {
    const cookieStore = cookies();
    const mmtkToken = cookieStore.get('mmtk');

    try {
        await axios.post(
            `${API_URL}`,
            {
                movieId,
                userId,
            },
            {
                headers: { Authorization: 'Bearer ' + mmtkToken?.value },
            },
        );
    } catch (error: any) {
        console.log(error);
        throw new Error('Cannot add new favorite movie');
    }
};

export const deleteFavoriteMovie = async ({ movieId, userId }: { movieId: number; userId: string }) => {
    const cookieStore = cookies();
    const mmtkToken = cookieStore.get('mmtk');

    try {
        await axios.delete(`${API_URL}/${movieId}/${userId}`, {
            headers: { Authorization: 'Bearer ' + mmtkToken?.value },
        });
    } catch (error: any) {
        console.log(error);
        throw new Error('Cannot delete new favorite movie');
    }
};

export const fetchListFavoriteMovies = async (userId: string) => {
    const cookieStore = cookies();
    const mmtkToken = cookieStore.get('mmtk');

    try {
        const res = await axios.get(`${API_URL}`, {
            headers: { Authorization: 'Bearer ' + mmtkToken?.value },
        });

        // console.log(res);

        const result = z.array(FavoriteMovieDtosSchema).safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot safe type favorite movies');
        }
    } catch (error: any) {
        console.log(error);
        throw new Error('Cannot get list favorite movies');
    }
};
