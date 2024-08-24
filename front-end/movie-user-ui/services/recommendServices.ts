import axios from 'axios';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/recommend';

export const fetchRecommendKeywords = async (query: string) => {
    try {
        const response = await axios.get(`${API_URL}`, {
            params: {
                query,
            },
        });

        const result = response.data;
        return result;
    } catch (error: any) {
        console.error('Error fetching search recommend:', error.message);
        throw new Error('Cannot fetch search recommend keywords');
    }
};
