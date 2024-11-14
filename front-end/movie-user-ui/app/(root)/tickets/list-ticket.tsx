'use client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { LoaderCircle, ScanLine, SearchX } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

import TicketBase from '@/components/cards/TicketBase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DetailTicket from './detail-ticket';

import { getTickets } from '@/services/reservationServices';
import { Movie } from '@/types/movie';
import { Ticket } from '@/types/ticket';

type Props = {
    userId: string;
    listPopularMovies: Movie[];
    listTickets: Ticket[];
};

const ListTicket = ({ userId, listTickets, listPopularMovies }: Props) => {
    const router = useRouter();
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
                    <div className="relative mt-10 flex-none rounded-lg bg-accent bg-white p-3 dark:bg-black">
                        <div className="flex gap-x-2">
                            <div className="relative w-1/3">
                                <Image
                                    src={
                                        activeTicket
                                            ? activeTicket.moviePoster
                                            : 'http://localhost:8272/api/v2/moon-movie/media/images/defaultBackdrop.jpg'
                                    }
                                    alt="movie-poster"
                                    height={70}
                                    width={50}
                                    quality={100}
                                    className="relative bottom-10 h-32 w-28 rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="line-clamp-2 font-bold uppercase">
                                    {activeTicket && activeTicket.movieTitle}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Created at:{' '}
                                    {format(
                                        activeTicket ? activeTicket.date : '2024-11-11T00:00:00',
                                        'dd MMM, yyyy - HH:mm',
                                    )}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Run time:{' '}
                                    <span className="font-medium text-black">
                                        {activeTicket && activeTicket.runtime} min
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="line-clamp-2 font-bold">{activeTicket && activeTicket.address}</p>
                        </div>
                        <div className="flex justify-between gap-x-5">
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-bold">
                                    {format(
                                        activeTicket ? activeTicket.date : '2024-11-11T00:00:00',
                                        'EEEE, dd MMM yyyy',
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-bold">
                                    {format(activeTicket ? activeTicket.date : '2024-11-11T00:00:00', 'HH:mm a')}
                                </p>
                            </div>
                        </div>
                        <div className="my-5 border-b-2 border-dashed pt-2">
                            <div className="absolute -left-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                            <div className="absolute -right-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Seat</p>
                                <p className="font-bold">{activeTicket && activeTicket.seatNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Row</p>
                                <p className="font-bold">{activeTicket && activeTicket.seatRow}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Cinema</p>
                                <p className="font-bold">{activeTicket && activeTicket.hall}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-x-5">
                            <div className="border">
                                <QRCode value={activeTicket ? activeTicket.id : ''} size={70} />
                            </div>
                            <p className="text-gray-500">Scan this code in front of the cinema hall to enter.</p>
                        </div>

                        <div className="absolute -top-10 right-0">
                            <Button
                                size="sm"
                                variant="link"
                                onClick={() => router.push(`/order/${activeTicket && activeTicket.orderId}`)}
                            >
                                <ScanLine className="me-2 size-5" />
                                Order detail
                            </Button>
                        </div>
                    </div>
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
