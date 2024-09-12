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

export type AuthError = {
    status: number;
    message: string;
};
