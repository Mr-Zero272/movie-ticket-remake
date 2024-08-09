'use server';
import { User, UserValidation } from '@/types/user';
import { clerkClient } from '@clerk/nextjs/server';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/user';

const getSessionToken = () => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    return __sessionToken?.value;
};

export const fetchUser = async (userId: string) => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    try {
        const response = await axios.get(`${API_URL}/${userId}`, {
            headers: { Authorization: 'Bearer ' + __sessionToken?.value },
        });

        const result = UserValidation.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot fetch user information');
        }
    } catch (error: any) {
        if (isAxiosError(error)) {
            if (error.response?.data?.message === 'This user does not exist in the system') {
                return null;
            }
        } else {
            throw new Error('Cannot fetch user information');
        }
    }
};

export const addUser = async (user: User) => {
    const __sessionToken = getSessionToken();
    if (!__sessionToken) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    // updateClerkUserInfo(user.username, user.name, '', user.userClerkId);

    try {
        const response = await axios.post(`${API_URL}`, user, {
            headers: { Authorization: 'Bearer ' + __sessionToken },
        });
        const result = UserValidation.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot add new user');
        }
    } catch (error: any) {
        console.error('Error add new user:', error.message);
        throw new Error('Cannot add new user');
    }
};

export const updateUser = async (user: User, userClerkId: string) => {
    const __sessionToken = getSessionToken();
    if (!__sessionToken) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const response = await axios.put(`${API_URL}/${userClerkId}`, user, {
            headers: { Authorization: 'Bearer ' + __sessionToken },
        });
        const result = UserValidation.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot update user');
        }
    } catch (error: any) {
        console.error('Error update user info:', error.message);
        throw new Error('Cannot update user');
    }
};

export const updateClerkUserInfo = async (username: string, firstName: string, lastName: string, userId: string) => {
    const updatedUser = await clerkClient.users.updateUser(userId, { firstName, lastName, username });

    if (!updatedUser) {
        throw new Error('Update user information in Clerk error!');
    }
};

export const updateClerkUserImage = async (avatar: File | Blob, userId: string) => {
    const params = {
        file: avatar,
    };
    const updateUserImage = await clerkClient.users.updateUserProfileImage(userId, params);

    if (!updateUserImage) {
        throw new Error('Update user image in Clerk error!');
    }
};
