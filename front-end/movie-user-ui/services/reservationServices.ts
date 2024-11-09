'use server';
import { ResponseApiTemplate } from '@/types/auth';
import { Order, OrderSchema, Payment, PaymentMethod, PaymentMethodSchema, PaymentSchema } from '@/types/order';
import { TicketSchema } from '@/types/ticket';
import axios, { isAxiosError } from 'axios';
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
    orderId,
    userId,
    method,
    amount,
    description,
    returnUrl,
    transactionId,
}: {
    orderId: string;
    userId: string;
    method: string;
    amount: number;
    description: string;
    returnUrl: string;
    transactionId: string;
}): Promise<PaymentMethod | ResponseApiTemplate> => {
    const mmtk = getToken();
    if (!mmtk) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const res = await axios.post(
            `${API_URL}/payment/method`,
            {
                orderId,
                userId,
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
        if (isAxiosError(error)) {
            console.log(error);

            return error.response?.data as ResponseApiTemplate;
        } else {
            console.log('Error creating new payment method', error.message);
            throw new Error('Cannot create new payment method');
        }
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

export const getTicketsByOrderId = async (orderId: string) => {
    const mmtk = getToken();
    if (!mmtk) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const res = await axios.get(`${API_URL}/ticket/order/${orderId}`, {
            headers: { Authorization: 'Bearer ' + mmtk },
            withCredentials: true,
        });

        const result = z.array(TicketSchema).safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid ticket data return from the request get ticket by order id');
        }
    } catch (error: any) {
        console.log('Error getting list tickets by orderId', error.message);
        throw new Error('Cannot get list tickets by orderId');
    }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
    const mmtk = getToken();
    if (!mmtk) {
        throw new Error('User not sign in yet, cannot get session token');
    }

    try {
        const res = await axios.get(`${API_URL}/order/${orderId}`, {
            headers: { Authorization: 'Bearer ' + mmtk },
            withCredentials: true,
        });

        const result = OrderSchema.safeParse(res.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Cannot valid order info');
        }
    } catch (error: any) {
        console.log('Error getting order info by id', error.message);
        return null;
    }
};
