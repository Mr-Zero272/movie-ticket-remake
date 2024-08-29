'use server';
import { CustomError } from '@/types/error';
import { FavoriteMovieDtosSchema } from '@/types/movie';
import { User, UserValidation } from '@/types/user';
import { clerkClient } from '@clerk/nextjs/server';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { z } from 'zod';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie/favorite';

const getSessionToken = () => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    return __sessionToken?.value;
};

export const addToFavorite = async ({ movieId, userId }: { movieId: number; userId: string }) => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    try {
        await axios.post(
            `${API_URL}`,
            {
                movieId,
                userId,
            },
            {
                headers: { Authorization: 'Bearer ' + __sessionToken?.value },
            },
        );
    } catch (error: any) {
        console.log(error);
        throw new Error('Cannot add new favorite movie');
    }
};

export const deleteFavoriteMovie = async ({ movieId, userId }: { movieId: number; userId: string }) => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    try {
        await axios.delete(`${API_URL}/${movieId}/${userId}`, {
            headers: { Authorization: 'Bearer ' + __sessionToken?.value },
        });
    } catch (error: any) {
        console.log(error);
        throw new Error('Cannot add new favorite movie');
    }
};

export const fetchListFavoriteMovies = async (userId: string) => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    try {
        const res = await axios.get(`${API_URL}/${userId}`, {
            headers: { Authorization: 'Bearer ' + __sessionToken?.value },
        });

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
