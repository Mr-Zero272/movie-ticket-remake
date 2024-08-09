import axios from 'axios';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/media';

export const addImageFiles = async (files: File[] | Blob[]) => {
    try {
        const response = await axios.post<string[]>(`${API_URL}/images`);
        return response.data;
    } catch (error: any) {
        console.error('Error adding images', error.message);
        throw new Error('Cannot add images');
    }
};
