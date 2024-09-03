import PaymentForm from '@/components/forms/PaymentForm';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createRandomTransId, formatCurrencyVND } from '@/lib/utils';
import { format } from 'date-fns';
import { Armchair, Calendar, MapPin, Projector, X } from 'lucide-react';
import React, { useState } from 'react';

type Props = {
    amount: number;
    onBackStep: () => void;
};

const Step2 = ({ amount, onBackStep }: Props) => {
    const [transId, setTransId] = useState(() => createRandomTransId());
    return (
        <div className="mt-5">
            <div className="flex gap-x-10 max-md:flex-col max-md:gap-0">
                <div className="flex flex-1 flex-col gap-y-5 max-md:mb-8">
                    <div className="flex items-center">
                        <Calendar className="size-6 w-1/5 text-gray-500" />
                        <div className="w-4/5 border-b border-b-gray-500 pb-3">
                            <p className="text-xs text-gray-500">DATE & TIME</p>
                            <p className="font-semibold">{format('2024-08-19T20:00:00', 'dd MMM - HH:mm')}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Projector className="size-6 w-1/5 text-gray-500" />
                        <div className="w-4/5 border-b border-b-gray-500 pb-3">
                            <p className="text-xs text-gray-500">Provider</p>
                            <p className="font-semibold">Moon Movie</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Armchair className="size-6 w-1/5 text-gray-500" />
                        <div className="w-4/5 border-b border-b-gray-500 pb-3">
                            <p className="text-xs text-gray-500">Hall & Seat</p>
                            <p className="font-semibold">Alpha Hall - A5, A6, B1</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="size-6 w-1/5 text-gray-500" />
                        <div className="w-4/5 border-b border-b-gray-500 pb-3">
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-semibold">xxx 3/2 Lorem, ipsum dolor.</p>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 rounded-md border p-8 shadow-md dark:border-gray-700 dark:bg-[#121212] max-md:w-full">
                    <div className="mb-2">
                        <h2 className="mb-2 text-base font-bold text-gray-500">ORDER SUMMARY</h2>
                        <div className="grid grid-cols-2 gap-5 p-2">
                            <div className="text-gray-500">
                                <p>Order Identify</p>
                                <p className="font-semibold text-black dark:text-white">{transId}</p>
                            </div>
                            <div className="text-gray-500">
                                <p>Provider</p>
                                <p className="font-semibold text-black dark:text-white">Moon movie</p>
                            </div>
                            <div className="text-gray-500">
                                <p>Customer</p>
                                <p className="font-semibold text-black dark:text-white">mr-zero272</p>
                            </div>
                            <div className="text-gray-500">
                                <p>Total</p>
                                <p className="font-semibold text-black dark:text-white">{formatCurrencyVND(amount)}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-2 text-base font-bold text-gray-500">PAYMENT FORM</h2>
                        <PaymentForm backBtn onBack={onBackStep} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2;
