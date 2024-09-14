'use server';
import { OrderSchema, PaymentMethodSchema, PaymentSchema } from '@/types/order';
import { TicketSchema } from '@/types/ticket';
import axios from 'axios';
import { cookies } from 'next/headers';
import { z } from 'zod';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/reservation';

const getToken = () => {
    const cookieStore = cookies();
    const mmtk = cookieStore.get('mmtk');

    return mmtk?.value;
};

export const addNewOrder = async ({
    startTime,
    customerId,
    showingId,
}: {
    startTime: string;
    customerId: string;
    showingId: number;
}) => {
    const mmtk = getToken();
    if (!mmtk) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const res = await axios.post(
            `${API_URL}/order`,
            {
                showingTime: startTime,
                customerId,
                showingId,
            },
            {
                headers: { Authorization: 'Bearer ' + mmtk },
                withCredentials: true,
            },
        );
        const result = OrderSchema.safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid order data return');
        }
    } catch (error: any) {
        console.log('Error adding new order', error.message);
        throw new Error('Cannot add new order');
    }
};

export const addNewPayment = async ({
    orderId,
    invoiceId,
    total,
    paymentStatus,
    method,
    description,
    customerEmail,
}: {
    orderId: string;
    invoiceId: string;
    total: number;
    paymentStatus: string;
    method: string;
    description: string;
    customerEmail: string;
}) => {
    const mmtk = getToken();
    if (!mmtk) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const res = await axios.post(
            `${API_URL}/payment`,
            {
                orderId,
                invoiceId,
                total,
                paymentStatus,
                method,
                description,
                customerEmail,
            },
            {
                headers: { Authorization: 'Bearer ' + mmtk },
                withCredentials: true,
            },
        );
        const result = PaymentSchema.safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid payment data return');
        }
    } catch (error: any) {
        console.log('Error adding new payment', error.message);
        throw new Error('Cannot add new payment');
    }
};

export const createPaymentToCheckout = async ({
    method,
    amount,
    description,
    returnUrl,
    transactionId,
}: {
    method: string;
    amount: number;
    description: string;
    returnUrl: string;
    transactionId: string;
}) => {
    const mmtk = getToken();
    if (!mmtk) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const res = await axios.post(
            `${API_URL}/payment/method`,
            {
                method,
                amount,
                description,
                returnUrl,
                transactionId,
            },
            {
                headers: { Authorization: 'Bearer ' + mmtk },
                withCredentials: true,
            },
        );
        const result = PaymentMethodSchema.safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid payment method data return');
        }
    } catch (error: any) {
        console.log('Error creating new payment method', error.message);
        throw new Error('Cannot create new payment method');
    }
};

export const getTickets = async ({
    filter,
    page = 1,
    size = 100,
}: {
    filter: 'all' | 'active' | 'expired' | 'unpaid';
    page: number;
    size: number;
}) => {
    const mmtk = getToken();
    if (!mmtk) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const res = await axios.get(`${API_URL}/ticket`, {
            headers: { Authorization: 'Bearer ' + mmtk },
            withCredentials: true,
            params: {
                filter,
                page,
                size,
            },
        });

        const result = z.array(TicketSchema).safeParse(res.data.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid ticket data return');
        }
    } catch (error: any) {
        console.log('Error getting list tickets', error.message);
        throw new Error('Cannot get list tickets');
    }
};
