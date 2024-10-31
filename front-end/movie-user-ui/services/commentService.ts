'use server';
import { Comment, CommentSchema } from '@/types/comment';
import { z } from 'zod';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { ResponseApiTemplate } from '@/types/auth';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/movie/comment';

const instanceCommentService = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: { withCredentials: true },
});

export const fetchCommentForMovie = async (movieId: number): Promise<Comment[]> => {
    try {
        const rawRes = await fetch(`${API_URL}/movie/${movieId}`);

        if (!rawRes.ok) {
            throw new Error(`Server error: ${rawRes.statusText}`);
        }

        const result = await rawRes.json();

        const safeResult = z.array(CommentSchema).safeParse(result);

        if (safeResult.success) {
            return safeResult.data;
        } else {
            throw new Error('Cannot valid list comments');
        }
    } catch (error: any) {
        console.error('Error fetching list comments:', error.message);
        return [];
    }
};

export const fetchCommentById = async (commentId: number): Promise<Comment | null> => {
    try {
        const rawRes = await fetch(`${API_URL}/${commentId}`);

        if (!rawRes.ok) {
            throw new Error(`Server error: ${rawRes.statusText}`);
        }

        const result = await rawRes.json();

        const safeResult = CommentSchema.safeParse(result);

        if (safeResult.success) {
            return safeResult.data;
        } else {
            throw new Error('Cannot valid list comments');
        }
    } catch (error: any) {
        console.error('Error fetching list comments:', error.message);
        return null;
    }
};

export const fetchRepliesForComment = async (commentId: number): Promise<Array<Comment>> => {
    try {
        const rawRes = await fetch(`${API_URL}/reply/${commentId}`);

        if (!rawRes.ok) {
            throw new Error(`Server error: ${rawRes.statusText}`);
        }

        const result = await rawRes.json();
        const safeResult = z.array(CommentSchema).safeParse(result);

        if (safeResult.success) {
            return safeResult.data;
        } else {
            throw new Error('Cannot valid list comments');
        }
    } catch (error: any) {
        console.error('Error fetching list comments:', error.message);
        return [];
        // throw new Error('Cannot fetch search recommend keywords');
    }
};

export const addNewComment = async (props: {
    userId: string;
    username: string;
    userProfileImage: string;
    content: string;
    movieId: number;
    parentCommentId: number | null | undefined;
}) => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');
    let bodyRequest = {};
    if (props.parentCommentId) {
        bodyRequest = props;
    } else {
        bodyRequest = {
            userId: props.userId,
            username: props.username,
            userProfileImage: props.userProfileImage,
            content: props.content,
            movieId: props.movieId,
        };
    }
    try {
        const response = await instanceCommentService.post('', bodyRequest, {
            headers: {
                Authorization: 'Bearer ' + token?.value,
            },
        });

        const result = CommentSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid comment information');
        }
    } catch (error: any) {
        console.log(error);
        if (isAxiosError(error)) {
            if (error.response?.data) {
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot add new comment information!');
        }
    }
};

export const editComment = async ({ commentId, content }: { commentId: number; content: string }) => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');

    try {
        const response = await instanceCommentService.put(
            `/${commentId}`,
            { content },
            {
                headers: {
                    Authorization: 'Bearer ' + token?.value,
                },
            },
        );

        const result = CommentSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid edit comment information');
        }
    } catch (error: any) {
        console.log(error);
        if (isAxiosError(error)) {
            if (error.response?.data) {
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot edit comment information!');
        }
    }
};

export const deleteComment = async (commentId: number) => {
    const cookieStore = cookies();
    const token = cookieStore.get('mmtk');

    try {
        const response = await instanceCommentService.delete(`/${commentId}`, {
            headers: {
                Authorization: 'Bearer ' + token?.value,
            },
        });

        const result = CommentSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid delete comment information');
        }
    } catch (error: any) {
        console.log(error);
        if (isAxiosError(error)) {
            if (error.response?.data) {
                return error.response.data as ResponseApiTemplate;
            }
        } else {
            throw new Error('Cannot delete comment information!');
        }
    }
};
