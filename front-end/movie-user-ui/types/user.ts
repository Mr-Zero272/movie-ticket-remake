import * as z from 'zod';

export const UserValidation = z.object({
    id: z.string(),
    userClerkId: z.string(),
    username: z.string(),
    name: z.string().min(3).max(30),
    bio: z.string().min(3).max(1000),
    avatar: z.string().url(),
    onboarded: z.boolean(),
});

export type User = z.infer<typeof UserValidation>;
