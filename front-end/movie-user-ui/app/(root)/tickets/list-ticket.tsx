'use client';
import TicketBase from '@/components/cards/TicketBase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { cn, formatCurrencyVND, formatMinutes } from '@/lib/utils';
import { Ticket } from '@/types/ticket';
import { format } from 'date-fns';
import { LoaderCircle, SearchX, TicketIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DetailTicket from './detail-ticket';
import { Movie } from '@/types/movie';
import { getTickets } from '@/services/reservationServices';

type Props = {
    userId: string;
    listPopularMovies: Movie[];
    listTickets: Ticket[];
};

const ListTicket = ({ userId, listTickets, listPopularMovies }: Props) => {
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'unpaid'>('all');
    const [tickets, setTickets] = useState(listTickets);
    const [activeTicket, setActiveTicket] = useState<null | Ticket>(() => {
        if (listTickets.length === 0) return null;
        return listTickets[0];
    });
    const [openDialog, setOpenDialog] = useState(false);

    const handleTicketClick = (ticket: Ticket) => {
        if (window.innerWidth <= 1490) {
            setOpenDialog(true);
        }
        setActiveTicket(ticket);
    };

    useEffect(() => {
        if (loading) return;

        const fetchApi = async () => {
            setLoading(true);
            const res = await getTickets({ filter: filter, page: 1, size: 100 });
            setTickets(res);
            setLoading(false);
        };

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);
    return (
        <>
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <DialogContent
                    onInteractOutside={() => setOpenDialog(false)}
                    onEscapeKeyDown={() => setOpenDialog(false)}
                    className="dark:border-none"
                >
                    <DialogHeader>
                        <div className="flex-none rounded-lg bg-white p-4 dark:bg-black">
                            <div className="flex justify-between gap-x-4 rounded-t-lg bg-[linear-gradient(to_right,#92fe9d_0%,#00c9ff_100%)] px-10 py-2 font-bold text-white dark:text-black">
                                <p>Moon Movie</p>
                                <TicketIcon className="text-gray-400" />
                                <p>Tickets</p>
                            </div>
                            <div className="relative rounded-b-lg bg-accent p-4 dark:bg-[#262626]">
                                <div className="flex justify-between gap-x-5">
                                    <div>
                                        <p className="text-sm text-gray-500">Movie</p>
                                        <p className="font-bold">{activeTicket && activeTicket.movieTitle}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-bold">
                                            {activeTicket && format(`${activeTicket.date}`, 'dd MMM, yyyy - h:mm a')}
                                        </p>
                                    </div>
                                </div>
                                <div className="my-5 border-b-2 border-dashed pt-5">
                                    <div className="absolute -left-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                                    <div className="absolute -right-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Seat</p>
                                        <p className="font-bold">{activeTicket && activeTicket.seatNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Row</p>
                                        <p className="font-bold">{activeTicket && activeTicket.seatRow}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Hall</p>
                                        <p className="font-bold">{activeTicket && activeTicket.hall}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 rounded-lg bg-accent p-4 dark:bg-[#262626]">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="font-bold">
                                            {activeTicket && formatCurrencyVND(activeTicket.price)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Runtime</p>
                                        <p className="font-bold">
                                            {activeTicket && formatMinutes(activeTicket.runtime)}
                                        </p>
                                    </div>
                                </div>
                                <div className="my-3 flex items-center justify-between gap-x-5">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="line-clamp-2 font-bold">{activeTicket && activeTicket.address}</p>
                                </div>
                                <div className="flex items-center justify-between gap-x-5">
                                    <Image src="/assets/qr-code.svg" alt="qr-code" width={100} height={100} />
                                    <p className="text-gray-500">
                                        Scan this code in front of the cinema hall to enter.
                                    </p>
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <Button>Save</Button>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="w-1/2 flex-none rounded-lg bg-white p-5 dark:bg-[#121212] max-[1490px]:w-2/3 max-md:w-full">
                <h1 className="my-5 text-3xl font-bold">Your tickets</h1>
                <div className="mb-5 flex gap-x-2">
                    <div
                        className={cn(
                            'cursor-pointer rounded-full border p-1.5 px-3 dark:border-none dark:bg-white dark:text-black',
                            { 'bg-primary text-white dark:bg-primary dark:text-white': filter === 'all' },
                        )}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </div>
                    <div
                        className={cn(
                            'cursor-pointer rounded-full border p-1.5 px-3 dark:border-none dark:bg-white dark:text-black',
                            { 'bg-primary text-white dark:bg-primary dark:text-white': filter === 'active' },
                        )}
                        onClick={() => setFilter('active')}
                    >
                        Active
                    </div>
                    <div
                        className={cn(
                            'cursor-pointer rounded-full border p-1.5 px-3 dark:border-none dark:bg-white dark:text-black',
                            { 'bg-primary text-white dark:bg-primary dark:text-white': filter === 'expired' },
                        )}
                        onClick={() => setFilter('expired')}
                    >
                        Expired
                    </div>
                    <div
                        className={cn(
                            'cursor-pointer rounded-full border p-1.5 px-3 dark:border-none dark:bg-white dark:text-black',
                            { 'bg-primary text-white dark:bg-primary dark:text-white': filter === 'unpaid' },
                        )}
                        onClick={() => setFilter('unpaid')}
                    >
                        Unpaid
                    </div>
                </div>
                <ul className="min-h-60 space-y-3 overflow-x-hidden overflow-y-scroll md:max-h-[23rem]">
                    {loading ? (
                        <div>
                            <li>
                                <div className="flex min-h-60 flex-col items-center justify-center">
                                    <LoaderCircle strokeWidth={1} className="size-10 animate-spin text-primary" />
                                </div>
                            </li>
                        </div>
                    ) : tickets.length === 0 ? (
                        <li>
                            <div className="flex flex-col items-center gap-y-3 text-center text-gray-500">
                                <SearchX strokeWidth={1} className="size-20 text-primary" />
                                <h2 className="text-3xl font-bold">Whoops!</h2>
                                <p>It seems like you do not have any tickets here.</p>
                            </div>
                        </li>
                    ) : (
                        tickets.map((ticket) => (
                            <li key={ticket.id}>
                                <TicketBase
                                    {...ticket}
                                    active={activeTicket ? activeTicket.id === ticket.id : false}
                                    onClick={() => handleTicketClick(ticket)}
                                />
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <DetailTicket userId={userId} activeTicket={activeTicket} listPopularMovies={listPopularMovies} />
        </>
    );
};

export default ListTicket;
