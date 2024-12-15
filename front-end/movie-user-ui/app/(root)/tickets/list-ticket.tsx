'use client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { LoaderCircle, ScanLine, SearchX } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';
import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

import TicketBase from '@/components/cards/TicketBase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DetailTicket from './detail-ticket';

import { getTickets } from '@/services/reservationServices';
import { Movie } from '@/types/movie';
import { Ticket } from '@/types/ticket';
import { SeatDetail } from '@/types/seat';

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
    const hasMounted = useRef(false);

    const handleTicketClick = (ticket: Ticket) => {
        if (window.innerWidth <= 1490) {
            setOpenDialog(true);
        }
        setActiveTicket(ticket);
    };

    useEffect(() => {
        if (loading) return;

        const fetchApi = async () => {
            if (!hasMounted.current) {
                hasMounted.current = true;
                return;
            }
            setLoading(true);
            const res = await getTickets({ filter: filter, page: 1, size: 30 });
            setTickets(res);
            if (res.length !== 0) {
                setActiveTicket(res[0]);
            }
            setLoading(false);
        };

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleChangeSeatPosition = useCallback((s: SeatDetail, ticketId: string) => {
        setActiveTicket((prev) => {
            if (prev !== null) {
                return {
                    ...prev,
                    seatId: s.id,
                    seatNumber: s.seat.numberSeat,
                    seatRow: s.seat.rowSeat,
                };
            } else {
                return prev;
            }
        });
        setTickets((prev) => {
            return prev.map((t) => {
                if (t.id === ticketId) {
                    return {
                        ...t,
                        seatId: s.id,
                        seatNumber: s.seat.numberSeat,
                        seatRow: s.seat.rowSeat,
                    };
                } else {
                    return t;
                }
            });
        });
    }, []);
    return (
        <>
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <DialogContent
                    onInteractOutside={() => setOpenDialog(false)}
                    onEscapeKeyDown={() => setOpenDialog(false)}
                    className="dark:border-none"
                >
                    <div className="relative mt-10 flex-none rounded-lg bg-accent bg-white p-3 dark:bg-black">
                        <DetailTicket
                            userId={userId}
                            activeTicket={activeTicket}
                            listPopularMovies={listPopularMovies}
                            onUpdatePosition={handleChangeSeatPosition}
                        />
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
            <div className="min-h-96 w-1/3 flex-none rounded-lg bg-white p-4 dark:bg-black max-[1490px]:hidden">
                <DetailTicket
                    userId={userId}
                    activeTicket={activeTicket}
                    listPopularMovies={listPopularMovies}
                    onUpdatePosition={handleChangeSeatPosition}
                />
            </div>
        </>
    );
};

export default ListTicket;
