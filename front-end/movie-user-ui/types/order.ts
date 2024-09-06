import { z } from 'zod';

export const PaymentSchema = z.object({
    invoiceId: z.string(),
    total: z.number(),
    paymentStatus: z.string(),
    method: z.string(),
    description: z.string(),
    timestamp: z.string(),
});

export const OrderSchema = z.object({
    id: z.string(),
    amount: z.number(),
    serviceFee: z.number(),
    customerId: z.string(),
    orderStatus: z.string(),
    timestamp: z.string(),
    payments: z.array(PaymentSchema),
});

export const PaymentMethodSchema = z.object({
    method: z.string(),
    urlPayment: z.string(),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export type Payment = z.infer<typeof PaymentSchema>;

export type Order = z.infer<typeof OrderSchema>;
