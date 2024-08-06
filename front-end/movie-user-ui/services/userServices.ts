import { type User } from '@/types/user';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = ' http://localhost:8272/api/v2/moon-movie/user';

export const fetchUser = async (userId: string) => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    try {
        const response = await axios.get(`${API_URL}/${userId}`, {
            headers: { Authorization: 'Bearer ' + __sessionToken?.value },
        });
        return response.data as User;
    } catch (error: any) {
        console.error('Error fetching user info:', error.message);
        throw error;
    }
};
