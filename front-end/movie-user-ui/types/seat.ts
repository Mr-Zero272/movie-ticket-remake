import * as z from 'zod';

export const AuditoriumSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
});

export const SeatSchema = z.object({
    id: z.string(),
    rowSeat: z.string(),
    numberSeat: z.number(),
    auditorium: AuditoriumSchema,
});

export const SeatDetailSchema = z.object({
    id: z.string(),
    status: z.string(),
    price: z.number(),
    userId: z.string(),
    showingId: z.number(),
    seat: SeatSchema,
});

export type Auditorium = z.infer<typeof AuditoriumSchema>;
export type Seat = z.infer<typeof SeatSchema>;
export type SeatDetail = z.infer<typeof SeatDetailSchema>;
