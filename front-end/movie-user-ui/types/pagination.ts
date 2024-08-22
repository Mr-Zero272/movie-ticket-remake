import * as z from 'zod';
import { MovieSchema } from './movie';

export const PaginationMovieSchema = z.object({
    data: z.array(MovieSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export type PaginationMovie = z.infer<typeof PaginationMovieSchema>;
