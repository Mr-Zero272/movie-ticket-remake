import TicketBase from '@/components/cards/TicketBase';
import { format } from 'date-fns';
import { Armchair, Calendar, MapPin, Projector } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Props = {};

function Tickets({}: Props) {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Tickets</h2>
            <div className="mt-5 flex gap-x-10">
                <div className="flex h-[33rem] flex-1 flex-col gap-y-5 overflow-auto">
                    <TicketBase />
                    <TicketBase />
                    <TicketBase />
                    <TicketBase />
                    <TicketBase />
                    <TicketBase />
                    <TicketBase />
                    <TicketBase />
                </div>
                <div className="w-1/3">
                    <div className="mb-5 flex items-center gap-x-5 rounded-md bg-accent p-5 shadow-md dark:bg-[#1f1f1f]">
                        <Image src="assets/qr-code.svg" alt="qr-code" width={50} height={50} />
                        <div className="text-sm text-gray-500">
                            <p className="mb-3">Scan QR code at the entrance of the cinema hall</p>
                            <p>
                                Booking ID: <span className="font-semibold text-black dark:text-white">43242352</span>
                            </p>
                        </div>
                    </div>
                    <div className="rounded-md bg-accent p-5 shadow-md dark:bg-[#1f1f1f]">
                        <div className="mb-7 flex items-center gap-x-5">
                            <Image
                                src="https://i.pinimg.com/originals/eb/61/63/eb61633611704442c0d3d5cabdc20b5d.jpg"
                                alt="poster"
                                width={500}
                                height={500}
                                className="h-40 w-32 object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-bold">Wonder Woman 1984</h3>
                                <p className="text-sm text-gray-500">ACTION - 123min</p>
                            </div>
                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tickets;
