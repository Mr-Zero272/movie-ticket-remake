import axios from 'axios';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/media';

export const addImageFiles = async (files: Array<File>) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await axios.post<string[]>(`${API_URL}/images`, formData);
        return response.data;
    } catch (error: any) {
        console.error('Error adding images', error.message);
        throw new Error('Cannot add images');
    }
};
