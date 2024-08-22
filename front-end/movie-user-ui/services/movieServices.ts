import { MovieSchema } from '@/types/movie';
import { PaginationMovieSchema } from '@/types/pagination';
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

export const fetchMovies = async (
    param: { page: number; size: number; type: 'popular' | 'upcoming' } | { q: string; page: number; size: number },
) => {
    let apiUrl = API_URL;
    let paramForApi = {};
    if ('q' in param) {
        paramForApi = { ...param };
    } else {
        if (param.type === 'popular') {
            apiUrl += '/popular';
        } else {
            apiUrl += '/upcoming';
        }
        paramForApi = { page: param.page, size: param.size };
    }
    try {
        const response = await axios.get(apiUrl, {
            params: {
                ...paramForApi,
            },
        });

        const result = z.array(MovieSchema).safeParse(response.data.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid list movies information');
        }
    } catch (error: any) {
        console.error('Error fetching list movies info:', error.message);
        throw new Error('Cannot fetch list movies information');
    }
};

export const fetchPopularMovies = async ({
    size = 20,
    page = 1,
    sort = 'releaseDate',
    genre = '',
}: {
    size: number;
    page: number;
    sort: string;
    genre: string | number;
}) => {
    try {
        const res = await axios.get(`${API_URL}/popular`, {
            params: {
                size,
                page,
                sort,
                genre,
            },
        });
        const result = PaginationMovieSchema.safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid list movies information');
        }
    } catch (error: any) {
        console.error('Error fetching list movies info:', error.message);
        throw new Error('Cannot fetch list movies information');
    }
};
