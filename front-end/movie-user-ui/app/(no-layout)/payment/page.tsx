'use client';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { createRandomTransId } from '@/lib/utils';
import { reservationServices } from '@/services';
import { Bot, Check, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Props = {};

const PaymentPage = (props: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mm_method = searchParams.get('mm_method');
    const mm_cemail = searchParams.get('mm_cemail');
    const mm_amount = searchParams.get('mm_amount');
    const mm_orderId = searchParams.get('mm_orderId');
    const mm_invoiceId = searchParams.get('mm_invoiceId');
    const vnPayReturnCode = searchParams.get('vnp_ResponseCode');
    const zalopayReturnCode = searchParams.get('status');

    if (
        mm_method === null ||
        mm_cemail === null ||
        mm_amount === null ||
        mm_orderId === null ||
        mm_invoiceId === null
    ) {
        router.replace('/');
    }

    const [countdown, setCountdown] = useState(30);
    const timer = useRef<any>(null);
    let success = false;
    if (mm_method !== null && mm_method === 'zalopay') {
        if (zalopayReturnCode !== null && +zalopayReturnCode === 1) {
            success = true;
        } else {
            success = false;
        }
    } else {
        if (vnPayReturnCode !== null && vnPayReturnCode === '00') {
            success = true;
        } else {
            success = false;
        }
    }

    useEffect(() => {
        timer.current = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => {
            clearInterval(timer.current);
        };
    }, []);

    const addPayment = () => {
        const callApi = async () => {
            if (
                mm_method === null ||
                mm_cemail === null ||
                mm_amount === null ||
                mm_orderId === null ||
                mm_invoiceId === null
            ) {
                return;
            }

            await reservationServices.addNewPayment({
                orderId: mm_orderId,
                invoiceId: mm_invoiceId,
                total: +mm_amount,
                paymentStatus: success ? 'paid' : 'failed',
                method: mm_method,
                description: 'Pay for Moon Movie tickets',
                customerEmail: mm_cemail,
            });
        };
        callApi();
    };

    useEffect(() => {
        if (countdown === 0) {
            clearInterval(timer.current);
            if (success) {
                addPayment();
                router.replace('/tickets');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);

    const handleContinue = () => {
        addPayment();
        router.replace('/tickets');
    };

    const handleTryAgain = async () => {
        if (
            mm_method === null ||
            mm_cemail === null ||
            mm_amount === null ||
            mm_orderId === null ||
            mm_invoiceId === null
        ) {
            return;
        }

        addPayment();
        const newTransId = createRandomTransId();

        const paymentMethod = await reservationServices.createPaymentToCheckout({
            method: mm_method,
            amount: +mm_amount,
            description: 'Pay for Moon Movie tickets',
            returnUrl: `http://localhost:3000/payment?mm_method=${mm_method}&mm_cemail=${mm_cemail}&mm_amount=${mm_amount}&mm_orderId=${mm_orderId}&mm_invoiceId=${newTransId}`,
            transactionId: newTransId,
        });
        router.replace(paymentMethod.urlPayment);
    };

    return (
        <div>
            <AlertDialog defaultOpen>
                <AlertDialogContent className="w-96 py-10">
                    <AlertDialogHeader>
                        {success ? (
                            <div className="text-center">
                                <div className="mb-4 flex flex-col items-center gap-y-5">
                                    <Check
                                        strokeWidth={3}
                                        className="size-32 rounded-full bg-green-500 p-4 text-white"
                                    />
                                    <h3 className="text-2xl font-bold text-[#767574] dark:text-white">
                                        Payment successfully!
                                    </h3>
                                </div>
                                <p className="mb-10 text-sm text-gray-500">
                                    Congratulations, you have just completed your order payment with Moon Movie. Thank
                                    you for your support.
                                </p>
                                <div>
                                    <p className="mb-2 text-sm text-gray-400">Auto redirect ({countdown})</p>
                                    <AlertDialogAction
                                        className="bg-green-500 hover:bg-green-500"
                                        onClick={handleContinue}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="mb-4 flex flex-col items-center gap-y-5">
                                    <X strokeWidth={3} className="size-32 rounded-full bg-red-500 p-4 text-white" />
                                    <h3 className="text-2xl font-bold text-[#767574] dark:text-white">
                                        Payment failure!
                                    </h3>
                                </div>
                                <p className="mb-10 text-sm text-gray-500">
                                    Whoops, there may have been a problem with the payment. Would you like to try again?
                                </p>
                                <div>
                                    <Button className="bg-red-500 hover:bg-red-500" onClick={handleTryAgain}>
                                        Try again
                                    </Button>
                                </div>
                            </div>
                        )}
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex min-h-96 w-full items-center justify-center">
                <Bot className="size-20 animate-bounce" />
            </div>
        </div>
    );
};

export default PaymentPage;
