import { MovieSchema } from '@/types/movie';
import { ShowingDtoSchema, ShowingSchema } from '@/types/showing';
import axios from 'axios';
import * as z from 'zod';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie';

export const fetchMovie = async (movieId: number) => {
    try {
        const response = await axios.get(`${API_URL}/${movieId}`);
        const result = MovieSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid movie information');
        }
    } catch (error: any) {
        console.error('Error fetching movie info:', error.message);
        throw new Error('Cannot fetch movie information');
    }
};

export const fetchShowings = async (startDate: string, movieId: number) => {
    try {
        const response = await axios.get(`${API_URL}/showing`, {
            params: {
                startDate,
                movieId,
            },
        });
        const result = z.array(ShowingDtoSchema).safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid showings information');
        }
    } catch (error: any) {
        console.error('Error fetching showings info:', error.message);
        throw new Error('Cannot fetch showings information');
    }
};

export const fetchShowing = async (showingId: number) => {
    try {
        const response = await axios.get(`${API_URL}/showing/${showingId}`);
        const result = ShowingSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid showing information');
        }
    } catch (error: any) {
        console.error('Error fetching showing info:', error.message);
        throw new Error('Cannot fetch showing information');
    }
};
