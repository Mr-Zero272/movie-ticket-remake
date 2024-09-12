import { z } from 'zod';

export const ResponseAuthTypeSchema = z.object({
    message: z.string(),
    token: z.string(),
    refreshToken: z.string(),
});

export type ResponseAuthType = z.infer<typeof ResponseAuthTypeSchema>;

export const SignInFormSchema = z.object({
    usernameOrEmail: z
        .string()
        .min(3, { message: 'Username or email must contain at least 3 character(s)' })
        .max(30, { message: 'Username or email must contain at most 30 character(s)' }),
    password: z.string().regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/), {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',
    }),
    keepLogin: z.boolean(),
});

export type SignInInfo = z.infer<typeof SignInFormSchema>;

export interface ErrorDetail {
    [field: string]: string; // Each error object has a field name as key and a string message as value
}

export interface ResponseApiTemplate {
    status: number; // The status code from the server
    message: string; // The message from the server (success or error)
    errors?: ErrorDetail[];
    generalErrors?: string[]; // The errors array, optional, can be 1 to many error objects or undefined
}
