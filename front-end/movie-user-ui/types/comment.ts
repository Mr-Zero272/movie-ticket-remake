import { z } from 'zod';

export const CommentSchema = z.object({
    id: z.number(),
    userId: z.string(),
    username: z.string(),
    userProfileImage: z.string(),
    content: z.string(),
    createdAt: z.string(),
    modifiedAt: z.string(),
});

export type Comment = z.infer<typeof CommentSchema>;
