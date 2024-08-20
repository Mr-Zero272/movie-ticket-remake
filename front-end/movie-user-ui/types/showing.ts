import * as z from 'zod';
import { MovieSchema } from './movie';

export const ShowingDtoSchema = z.object({
    id: z.number(),
    type: z.string(),
    startTime: z.string(),
    auditoriumId: z.string(),
    priceEachSeat: z.number(),
});

export const ShowingSchema = z.object({
    id: z.number(),
    startTime: z.string(),
    type: z.string(),
    auditoriumId: z.string(),
    priceEachSeat: z.number(),
    movie: MovieSchema,
});

export type ShowingDto = z.infer<typeof ShowingDtoSchema>;
export type Showing = z.infer<typeof ShowingSchema>;
