import { z } from 'zod';

export const ResponseAuthTypeSchema = z.object({
    message: z.string(),
    token: z.string(),
    refreshToken: z.string(),
});

export type ResponseAuthType = z.infer<typeof ResponseAuthTypeSchema>;

export const SignUpFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'Username must contain at least 3 character(s)' })
        .max(30, { message: 'Username must contain at most 30 character(s)' }),
    email: z.string().email(),
    password: z.string().regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one special character, one number and at least 8 characters.',
    }),
    keepLogin: z.boolean(),
});

export type SignUpInfo = z.infer<typeof SignUpFormSchema>;

export const SignInFormSchema = z.object({
    usernameOrEmail: z
        .string()
        .min(3, { message: 'Username or email must contain at least 3 character(s)' })
        .max(150, { message: 'Username or email must contain at most 150 character(s)' }),
    password: z.string().regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one special character, one number and at least 8 characters',
    }),
    keepLogin: z.boolean(),
});

export type SignInInfo = z.infer<typeof SignInFormSchema>;

export const SignInGoogleSchema = z.object({
    redirectUri: z.string(),
    code: z.string(),
    keepLogin: z.boolean(),
});

export type SignInGoogle = z.infer<typeof SignInGoogleSchema>;

export interface ErrorDetail {
    [field: string]: string; // Each error object has a field name as key and a string message as value
}

export interface ResponseApiTemplate {
    status: number; // The status code from the server
    message: string; // The message from the server (success or error)
    errors?: ErrorDetail | {};
    generalErrors?: string[]; // The errors array, optional, can be 1 to many error objects or undefined
}

export const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    bio: z.string().nullable(),
    avatar: z.string().nullable(),
    onboarded: z.boolean(),
    createdAt: z.string(),
    modifiedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
