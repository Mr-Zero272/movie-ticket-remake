import { AuthError, ResponseAuthTypeSchema, SignInInfo } from '@/types/auth';
import axios, { isAxiosError } from 'axios';

const instanceAuthService = axios.create({
    baseURL: 'http://localhost:8272/api/v2/moon-movie/auth',
    timeout: 1000,
    headers: { withCredentials: true },
});

export const authenticate = async (signInInFor: SignInInfo) => {
    try {
        const response = await instanceAuthService.post('/authenticate', {
            ...signInInFor,
        });

        const result = ResponseAuthTypeSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid authenticate response');
        }
    } catch (error: any) {
        console.log(error);
        if (isAxiosError(error)) {
            if (error.response?.data) {
                return error.response.data as AuthError;
            }
        } else {
            throw new Error('Cannot authenticate user!');
        }
    }
};
