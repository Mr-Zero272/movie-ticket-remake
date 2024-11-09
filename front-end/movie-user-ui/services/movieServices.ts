import { GenreSchema, MovieSchema } from '@/types/movie';
import { PaginationMovieSchema, PaginationShowingSchema } from '@/types/pagination';
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

export const fetchScheduleShowings = async (date: string, page: number = 1, size: number = 10) => {
    try {
        const response = await axios.get(`${API_URL}/showing/schedule`, {
            params: {
                date,
                page,
                size,
            },
        });

        const result = PaginationShowingSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid schedule showings information');
        }
    } catch (error: any) {
        console.error('Error fetching schedule showings info:', error.message);
        throw new Error('Cannot fetch schedule showings information');
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

export const fetchUpcomingMovies = async ({ size = 20, page = 1 }: { size: number; page: number }) => {
    try {
        const res = await axios.get(`${API_URL}/upcoming`, {
            params: {
                size,
                page,
            },
        });
        const result = PaginationMovieSchema.safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid list upcoming movies information');
        }
    } catch (error: any) {
        console.error('Error fetching list upcoming movies info:', error.message);
        throw new Error('Cannot fetch list upcoming movies information');
    }
};

export const fetchPopularMovies = async ({
    size = 20,
    page = 1,
    sort = 'releaseDate',
    genreId = 0,
}: {
    size: number;
    page: number;
    sort: string;
    genreId: string | number;
}) => {
    try {
        const res = await axios.get(`${API_URL}/popular`, {
            params: {
                size,
                page,
                sort,
                genreId,
            },
        });

        const result = PaginationMovieSchema.safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid list popular movies information');
        }
    } catch (error: any) {
        console.error('Error fetching list popular movies info:', error.message);
        throw new Error('Cannot fetch list popular movies information');
    }
};

export const fetchMovies = async ({
    q = '',
    originalLanguage = '',
    status = '',
    sort = 'none',
    genreId = 0,
    page = 1,
    size = 20,
}: {
    q?: string;
    originalLanguage?: string;
    status?: string;
    size?: number;
    page?: number;
    sort?: string;
    genreId?: string | number;
}) => {
    try {
        const res = await axios.get(`${API_URL}`, {
            params: {
                q,
                originalLanguage,
                status,
                size,
                page,
                sort,
                genreId,
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
        return { data: [], page: 1, size: 10, totalPages: 0, totalElements: 0 };
    }
};

export const fetchAllGenres = async (page: number = 1, size: number = 30) => {
    try {
        const res = await axios.get(`${API_URL}/genre`, {
            params: {
                page,
                size,
            },
        });
        const result = z.array(GenreSchema).safeParse(res.data.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid list genres information');
        }
    } catch (error: any) {
        console.error('Error fetching list genres info:', error.message);
        throw new Error('Cannot fetch list genres information');
    }
};

export const fetchRecommendMovies = async (movieId: number) => {
    try {
        const res = await axios.get(`${API_URL}/recommend`, {
            params: {
                movieId,
            },
        });
        const result = z.array(MovieSchema).safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid recommend movies information');
        }
    } catch (error: any) {
        console.error('Error fetching list recommend movies:', error.message);
        return [];
    }
};
