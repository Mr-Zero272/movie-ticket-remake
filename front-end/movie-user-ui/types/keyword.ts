import { z } from 'zod';

export const KeywordSchema = z.object({
    keyword: z.string(),
    isHistory: z.boolean().default(false),
});

export type Keyword = z.infer<typeof KeywordSchema>;
