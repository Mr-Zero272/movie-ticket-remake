'use server';
import {
    ResponseApiTemplate,
    ResponseAuthTypeSchema,
    SignInGoogle,
    SignInInfo,
    SignUpInfo,
    UserSchema,
} from '@/types/auth';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';

const instanceAuthService = axios.create({
    baseURL: 'http://localhost:8272/api/v2/moon-movie/auth',
    timeout: 5000,
    headers: { withCredentials: true },
});

export const register = async (signUpInfo: SignUpInfo) => {
    try {
        const response = await instanceAuthService.post('/register', {
            ...signUpInfo,
        });

        const result = ResponseAuthTypeSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid register response');
        }
    } catch (error: any) {
        console.log(error);
        if (isAxiosError(error)) {
            if (error.response?.data) {
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot register new user!');
        }
    }
};

export const authenticate = async (signInInFo: SignInInfo) => {
    try {
        const response = await instanceAuthService.post('/authenticate', {
            ...signInInFo,
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
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot authenticate user!');
        }
    }
};

export const authenticateWithGoogle = async (signInInFor: SignInGoogle) => {
    try {
        const response = await instanceAuthService.post('/authenticate/google', {
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
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot authenticate user!');
        }
    }
};

export const getUserInfo = async (token: string) => {
    try {
        const response = await instanceAuthService.get('/user', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        const result = UserSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid user information');
        }
    } catch (error: any) {
        console.log(error);
        if (isAxiosError(error)) {
            if (error.response?.data) {
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot fetch user information!');
        }
    }
};

export const currentUser = async () => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');
    try {
        const response = await instanceAuthService.get('/user', {
            headers: {
                Authorization: `Bearer ${token?.value}`,
            },
        });

        const result = UserSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid user information');
        }
    } catch (error: any) {
        console.log(error);
        return undefined;
    }
};

export const updateUser = async (userInfo: {
    username: string;
    email: string;
    name: string;
    bio: string;
    avatar: string;
}) => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');
    try {
        const response = await instanceAuthService.put(
            '/user',
            {
                ...userInfo,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                },
            },
        );

        const result = UserSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid user information');
        }
    } catch (error: any) {
        if (isAxiosError(error)) {
            if (error.response?.data) {
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot fetch user information!');
        }
    }
};
