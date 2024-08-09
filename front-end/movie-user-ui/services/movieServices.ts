import { movieSchema } from '@/types/movie';
import axios from 'axios';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie';

export const fetchMovie = async (movieId: string) => {
    try {
        const response = await axios.get(`${API_URL}/${movieId}`);
        const result = movieSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot fetch movie information');
        }
    } catch (error: any) {
        console.error('Error fetching user info:', error.message);
        throw new Error('Cannot fetch movie information');
    }
};
