'use server';
import { CustomError } from '@/types/error';
import { OrderSchema, PaymentMethodSchema, PaymentSchema } from '@/types/order';
import { User, UserValidation } from '@/types/user';
import { clerkClient } from '@clerk/nextjs/server';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';

const API_URL = 'http://localhost:8272/api/v2/moon-movie/reservation';

const getSessionToken = () => {
    const cookieStore = cookies();
    const __sessionToken = cookieStore.get('__session');

    return __sessionToken?.value;
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
    const __sessionToken = getSessionToken();
    if (!__sessionToken) {
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
                headers: { Authorization: 'Bearer ' + __sessionToken },
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
    const __sessionToken = getSessionToken();
    if (!__sessionToken) {
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
                headers: { Authorization: 'Bearer ' + __sessionToken },
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
    const __sessionToken = getSessionToken();
    if (!__sessionToken) {
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
                headers: { Authorization: 'Bearer ' + __sessionToken },
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
