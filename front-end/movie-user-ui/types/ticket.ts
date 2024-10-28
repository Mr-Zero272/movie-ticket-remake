import { z } from 'zod';

export const TicketSchema = z.object({
    id: z.string(),
    seatId: z.string(),
    movieTitle: z.string(),
    moviePoster: z.string(),
    date: z.string(),
    runtime: z.number(),
    seatNumber: z.number(),
    seatRow: z.string(),
    price: z.number(),
    hall: z.string(),
    address: z.string(),
    showingId: z.number(),
    createdAt: z.string(),
    orderId: z.string(),
});

export type Ticket = z.infer<typeof TicketSchema>;
