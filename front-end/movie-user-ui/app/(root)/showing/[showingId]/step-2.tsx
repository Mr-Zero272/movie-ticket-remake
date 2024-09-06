import PaymentForm from '@/components/forms/PaymentForm';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createRandomTransId, formatCurrencyVND } from '@/lib/utils';
import { SeatDetail } from '@/types/seat';
import { format } from 'date-fns';
import { Armchair, Calendar, MapPin, Projector, X } from 'lucide-react';
import React, { useId, useState } from 'react';

const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

type Props = {
    userId: string;
    userName: string;
    showingId: number;
    amount: number;
    dateTime: string;
    seats: SeatDetail[];
    hallName: string;
    hallAddress: string;
    onBackStep: () => void;
};

const Step2 = ({ userId, showingId, userName, amount, dateTime, seats, hallName, hallAddress, onBackStep }: Props) => {
    const [transId, setTransId] = useState(() => createRandomTransId());
    return (
        <div className="mt-5">
            <div className="flex gap-x-10 max-md:flex-col max-md:gap-0">
                <div className="flex flex-1 flex-col gap-y-5 max-md:mb-8">
                    <div className="flex items-center">
                        <Calendar className="size-6 w-1/5 text-gray-500" />
                        <div className="w-4/5 border-b border-b-gray-500 pb-3">
                            <p className="text-xs text-gray-500">DATE & TIME</p>
                            <p className="font-semibold">
                                {dateTime !== '' ? format(dateTime, 'dd MMM - HH:mm') : 'xx XXX - XX:xx'}
                            </p>
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
                            <p className="font-semibold">
                                {hallName} - {formatter.format(seats.map((s) => s.seat.numberSeat.toString()))}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="size-6 w-1/5 text-gray-500" />
                        <div className="w-4/5 border-b border-b-gray-500 pb-3">
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-semibold">{hallAddress}</p>
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
                                <p className="font-semibold text-black dark:text-white">{userName}</p>
                            </div>
                            <div className="text-gray-500">
                                <p>Total</p>
                                <p className="font-semibold text-black dark:text-white">{formatCurrencyVND(amount)}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-2 text-base font-bold text-gray-500">PAYMENT FORM</h2>
                        <PaymentForm
                            invoiceId={transId}
                            total={amount}
                            startTime={dateTime}
                            showingId={showingId}
                            customerId={userId}
                            backBtn
                            onBack={onBackStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2;
