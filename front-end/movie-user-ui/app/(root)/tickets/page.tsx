'use client';
import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';
import TicketBase from '@/components/cards/TicketBase';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn, formatCurrencyVND, formatMinutes } from '@/lib/utils';
import { format } from 'date-fns';
import {
    Armchair,
    BadgeHelp,
    Calendar,
    CalendarCheck,
    Heart,
    MapPin,
    Monitor,
    MonitorPlay,
    Projector,
    SearchX,
    Star,
    TableRowsSplit,
    Tag,
    Ticket,
    TicketSlash,
} from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type Props = {};

function Tickets({}: Props) {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        if (window.innerWidth <= 1490) {
            setOpenDialog(true);
        }
    };

    return (
        <>
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <DialogContent
                    onInteractOutside={() => setOpenDialog(false)}
                    onEscapeKeyDown={() => setOpenDialog(false)}
                >
                    <DialogHeader>
                        <div className="flex-none rounded-lg bg-white p-4 dark:bg-black">
                            <div className="flex justify-between gap-x-4 rounded-t-lg bg-[linear-gradient(to_right,#92fe9d_0%,#00c9ff_100%)] px-10 py-2 font-bold text-white dark:text-black">
                                <p>Moon Movie</p>
                                <Ticket className="text-gray-400" />
                                <p>Tickets</p>
                            </div>
                            <div className="relative rounded-b-lg bg-accent p-4 dark:bg-[#262626]">
                                <div className="flex justify-between gap-x-5">
                                    <div>
                                        <p className="text-sm text-gray-500">Movie</p>
                                        <p className="font-bold">The Lord of the Rings: The Rings of Power</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-bold">
                                            {format('2024-08-19T20:00:00', 'dd MMM, yyyy - h:mm a')}
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
                                        <p className="font-bold">145</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Row</p>
                                        <p className="font-bold">A</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Hall</p>
                                        <p className="font-bold">Alpha</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 rounded-lg bg-accent p-4 dark:bg-[#262626]">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="font-bold">{formatCurrencyVND(100000)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Runtime</p>
                                        <p className="font-bold">{formatMinutes(123)}</p>
                                    </div>
                                </div>
                                <div className="my-3 flex items-center justify-between gap-x-5">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="line-clamp-2 font-bold">Lorem ipsum dolor sit amet.</p>
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
            <div className="max-sm:h-70rem flex max-h-[35rem] gap-3 rounded-lg bg-black p-4 dark:bg-white max-sm:max-h-[70rem]">
                <div className="w-1/2 flex-none rounded-lg bg-white p-5 dark:bg-[#121212] max-[1490px]:w-2/3 max-md:w-full">
                    <h1 className="my-5 text-3xl font-bold">Your tickets</h1>
                    <div className="mb-5 flex gap-x-2">
                        <div
                            className={cn('cursor-pointer rounded-full p-1.5 px-3', { 'bg-primary text-white': true })}
                        >
                            All
                        </div>
                        <div className="cursor-pointer rounded-full border p-1.5 px-3 dark:border-none dark:bg-white dark:text-black">
                            Active
                        </div>
                        <div className="cursor-pointer rounded-full border p-1.5 px-3 dark:border-none dark:bg-white dark:text-black">
                            Expired
                        </div>
                    </div>
                    <ul className="max-h-[23rem] space-y-3 overflow-x-hidden overflow-y-scroll">
                        {/* <li>
                            <div className="flex flex-col items-center gap-y-3 text-center text-gray-500">
                                <SearchX strokeWidth={1} className="size-20 text-primary" />
                                <h2 className="text-3xl font-bold">Whoops!</h2>
                                <p>It seems like you do not have any tickets here.</p>
                            </div>
                        </li> */}
                        <li>
                            <TicketBase active onClick={handleOpenDialog} />
                        </li>
                        <li>
                            <TicketBase onClick={handleOpenDialog} />
                        </li>
                        <li>
                            <TicketBase onClick={handleOpenDialog} />
                        </li>
                        <li>
                            <TicketBase onClick={handleOpenDialog} />
                        </li>
                    </ul>
                </div>
                <div className="flex max-h-[35rem] w-1/2 max-[1490px]:w-1/3 max-md:hidden">
                    <div className="min-h-96 w-2/3 flex-none rounded-lg bg-white p-4 dark:bg-black max-[1490px]:hidden">
                        <h2 className="w-fit border-b-2 border-b-primary text-2xl font-bold">Queue</h2>
                        <h3 className="mt-2 font-bold">Popular movies</h3>
                        <ul className="mt-5 max-h-[26rem] space-y-2 overflow-y-scroll">
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                            <li>
                                <MovieCardItemHorizontal loading />
                            </li>
                        </ul>
                    </div>
                    {/* <div className="min-h-96 w-2/3 flex-none rounded-lg bg-white p-4 dark:bg-black">
                        <div className="flex justify-between gap-x-4 rounded-t-lg bg-[linear-gradient(to_right,#92fe9d_0%,#00c9ff_100%)] px-10 py-2 font-bold text-white dark:text-black">
                            <p>Moon Movie</p>
                            <Ticket className="text-gray-400" />
                            <p>Tickets</p>
                        </div>
                        <div className="relative rounded-b-lg bg-accent p-4 dark:bg-[#262626]">
                            <div className="flex justify-between gap-x-5">
                                <div>
                                    <p className="text-sm text-gray-500">Movie</p>
                                    <p className="font-bold">The Lord of the Rings: The Rings of Power</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date & Time</p>
                                    <p className="font-bold">{format('2024-08-19T20:00:00', 'dd MMM, yyyy - h:mm a')}</p>
                                </div>
                            </div>
                            <div className="my-5 border-b-2 border-dashed pt-5">
                                <div className="absolute -left-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                                <div className="absolute -right-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Seat</p>
                                    <p className="font-bold">145</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Row</p>
                                    <p className="font-bold">A</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Hall</p>
                                    <p className="font-bold">Alpha</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 rounded-lg bg-accent p-4 dark:bg-[#262626]">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Price</p>
                                    <p className="font-bold">{formatCurrencyVND(100000)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Runtime</p>
                                    <p className="font-bold">{formatMinutes(123)}</p>
                                </div>
                            </div>
                            <div className="my-3 flex items-center justify-between gap-x-5">
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="line-clamp-2 font-bold">Lorem ipsum dolor sit amet.</p>
                            </div>
                            <div className="flex items-center justify-between gap-x-5">
                                <Image src="/assets/qr-code.svg" alt="qr-code" width={70} height={70} />
                                <p className="text-gray-500">Scan this code in front of the cinema hall to enter.</p>
                            </div>
                            <div className="mt-2 flex justify-end">
                                <Button>Save</Button>
                            </div>
                        </div>
                    </div> */}
                    <div className="mr ml-3 flex-1">
                        <div className="flex flex-col items-center gap-y-5">
                            <Image
                                src="https://i.pinimg.com/originals/96/ad/64/96ad64f209d2a8be2e52ba593f0a03c4.jpg"
                                alt="avatar"
                                width={400}
                                height={400}
                                quality={100}
                                className="size-20 rounded-full object-cover"
                            />
                            <div className="text-white dark:text-black">
                                <p>Hello,</p>
                                <p className="text-2xl font-bold">pitithuong</p>
                            </div>
                        </div>
                        <div className="mt-5 space-y-2 rounded-lg bg-white p-4 dark:bg-[#121212]">
                            <div className="flex items-center gap-x-3">
                                <Monitor className="size-8 rounded-lg bg-green-200 p-1.5 text-green-800" />
                                <div className="text-sm">
                                    <p className="font-bold">Total tickets</p>
                                    <p className="text-gray-500">5 tickets</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <CalendarCheck className="size-8 rounded-lg bg-blue-200 p-1.5 text-blue-800" />
                                <div className="text-sm">
                                    <p className="font-bold">Total orders</p>
                                    <p className="text-gray-500">10 orders</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <Heart className="size-8 rounded-lg bg-yellow-200 p-1.5 text-yellow-800" />
                                <div className="text-sm">
                                    <p className="font-bold">Favorite movies</p>
                                    <p className="text-gray-500">10 movies</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col items-center space-y-2 rounded-lg bg-white p-4 dark:bg-[#121212]">
                            <BadgeHelp className="size-10 text-gray-500" />
                            <p className="text-center font-bold">Some thing wrong with the tickets!</p>
                            <button className="w-full rounded-full bg-primary py-1.5 text-white dark:bg-black">
                                Contact now!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tickets;
