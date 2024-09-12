import { z } from 'zod';

export const OrderIdSchema = z.object({
    timestamp: z.number(),
    date: z.string(),
});

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
    orderId: OrderIdSchema,
});

export type OrderId = z.infer<typeof OrderIdSchema>;

export type Ticket = z.infer<typeof TicketSchema>;
