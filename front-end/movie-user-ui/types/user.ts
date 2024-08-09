import * as z from 'zod';

export const UserValidation = z.object({
    id: z.string(),
    userClerkId: z.string(),
    username: z.string().min(3).max(30),
    name: z.string().min(3).max(30),
    bio: z.string().min(3).max(1000),
    avatar: z.string().url(),
    onboarded: z.boolean(),
    createdAt: z.string(),
    modifiedAt: z.string(),
    role: z.string(),
});

export type User = z.infer<typeof UserValidation>;
