'use client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {};

const PaymentPage = (props: Props) => {
    const [countdown, setCountdown] = useState(5);
    const timer = useRef<any>(null);
    const success = true;
    useEffect(() => {
        timer.current = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => {
            clearInterval(timer.current);
        };
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            clearInterval(timer.current);
        }
    }, [countdown]);
    return (
        <div>
            <AlertDialog defaultOpen>
                <AlertDialogContent className="w-96">
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
                                    <AlertDialogAction className="bg-green-500 hover:bg-green-500">
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
                                    <p className="mb-2 text-sm text-gray-400">Auto redirect ({countdown})</p>
                                    <Button className="bg-red-500 hover:bg-red-500">Try again</Button>
                                </div>
                            </div>
                        )}
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PaymentPage;
