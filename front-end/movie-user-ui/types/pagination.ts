import * as z from 'zod';
import { MovieSchema } from './movie';
import { ShowingSchema } from './showing';

export const PaginationMovieSchema = z.object({
    data: z.array(MovieSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export type PaginationMovie = z.infer<typeof PaginationMovieSchema>;

export const PaginationShowingSchema = z.object({
    data: z.array(ShowingSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export type PaginationShowing = z.infer<typeof PaginationShowingSchema>;
