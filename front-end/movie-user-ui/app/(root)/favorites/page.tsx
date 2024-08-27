'use client';
import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';
import MarqueeText from '@/components/ui/marquee-text';
import SearchInputHidden from '@/components/ui/search-hidden-input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { timeAgo } from '@/lib/utils';
import { Heart, Logs, Play, SearchX, SquareChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const invoices = [
    {
        invoice: 'INV001',
        paymentStatus: 'Paid',
        totalAmount: '$250.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV002',
        paymentStatus: 'Pending',
        totalAmount: '$150.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV003',
        paymentStatus: 'Unpaid',
        totalAmount: '$350.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV004',
        paymentStatus: 'Paid',
        totalAmount: '$450.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV005',
        paymentStatus: 'Paid',
        totalAmount: '$550.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV006',
        paymentStatus: 'Pending',
        totalAmount: '$200.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV007',
        paymentStatus: 'Unpaid',
        totalAmount: '$300.00',
        paymentMethod: 'Credit Card',
    },
];

type Props = {};

const FavoritesPage = (props: Props) => {
    const [isSideOpen, setIsSideOpen] = useState(true);

    const handleOpenSide = () => {
        setIsSideOpen((prev) => !prev);
    };
    return (
        <section className="relative flex gap-x-2 p-4">
            <article className="max-h-[33rem] min-h-96 flex-1 overflow-scroll rounded-lg">
                <div className="flex h-56 items-end gap-x-5 rounded-t-lg bg-[#0093E9] bg-[linear-gradient(160deg,#0093E9_0%,#80D0C7_100%)] p-5">
                    <div className="w-fit rounded-md bg-[#0093E9] bg-[linear-gradient(160deg,#0093E9_0%,#80D0C7_50%,#ffffff_100%)] p-16 max-md:p-10">
                        <Heart className="size-14 fill-white text-white dark:fill-black dark:text-black" />
                    </div>
                    <div>
                        <p className="text-sm text-white dark:text-black">List</p>
                        <h2 className="text-5xl font-bold text-white dark:text-black max-md:text-xl">Liked Movies</h2>
                        <p className="text-sm text-white dark:text-black">
                            <span>Piti Thuong</span> - <span>10 movies</span>
                        </p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-end gap-x-5">
                        <SearchInputHidden widthResponsive="max-md:w-32" />
                        <div className="flex items-center gap-x-2">
                            <p>Date added</p> <Logs />
                        </div>
                        <div className="max-[1200px]:hidden">
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <SquareChevronRight className="cursor-pointer" onClick={handleOpenSide} />
                                    </TooltipTrigger>
                                    <TooltipContent className="dark:border-none">
                                        <p>Open popular movie</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex flex-col items-center gap-y-3 text-center text-gray-500">
                            <SearchX strokeWidth={1} className="size-20 text-primary" />
                            <h2 className="text-3xl font-bold">Whoops!</h2>
                            <p>It seems like you do not have any favorite movies here.</p>
                        </div>
                        <Table>
                            <TableCaption>A list of your favorite movies.</TableCaption>
                            <TableHeader className="sticky top-0">
                                <TableRow>
                                    <TableHead className="w-10 max-[450px]:hidden">#</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="max-sm:hidden">Date added</TableHead>
                                    <TableHead className="text-right max-[450px]:hidden">Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice, index) => (
                                    <TableRow key={invoice.invoice}>
                                        <TableCell className="font-medium max-[450px]:hidden">{index + 1}</TableCell>
                                        <TableCell>
                                            <MovieCardItemHorizontal />
                                        </TableCell>
                                        <TableCell className="max-sm:hidden">
                                            {timeAgo('2024-08-26T00:00:00')}
                                        </TableCell>
                                        <TableCell className="text-right max-[450px]:hidden">
                                            {invoice.totalAmount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </article>
            {isSideOpen && (
                <article className="max-h-[33rem] min-h-96 w-64 flex-none overflow-scroll rounded-lg px-5 dark:bg-[#121212] max-[1200px]:hidden">
                    <div className="sticky top-0 z-50 mb-3 flex items-center justify-between bg-white py-2">
                        <h1 className="font-bold">Popular Movies</h1>
                        <X
                            className="size-8 cursor-pointer rounded-full p-1.5 hover:bg-accent active:text-gray-500 dark:text-white dark:active:text-gray-400"
                            onClick={handleOpenSide}
                        />
                    </div>
                    <div className="">
                        <div className="relative mb-3">
                            <Image
                                src="https://i.pinimg.com/originals/39/ae/2b/39ae2b2ab480cb2e8f6ea7e4e520a4fa.jpg"
                                alt="poster"
                                width={300}
                                height={330}
                                quality={100}
                                className="h-60 w-full rounded-xl"
                            />
                            <div className="absolute bottom-3 right-3 cursor-pointer rounded-xl bg-white p-2">
                                <Play className="size-5 dark:text-black" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <MarqueeText className="text-lg font-bold" text="Blue archive" duration={2} />
                                <p className="text-sm text-gray-500">Action, Comedy, Romantic</p>
                            </div>
                            <Heart className="size-5" />
                        </div>
                        <div className="mt-2 p-2">
                            <div className="rounded-md p-3 dark:bg-[#1f1f1f]">
                                <p>Next in queue</p>
                                <div className="mt-3 overflow-hidden">
                                    <div className="mb-2 flex gap-x-2">
                                        <div className="w-1/3">
                                            <Image
                                                src="https://i.pinimg.com/originals/11/d5/25/11d52562a64c9da5e4674308f7b69924.jpg"
                                                alt="movie 1 image"
                                                width={500}
                                                height={500}
                                                className="size-12 rounded-md object-cover"
                                                quality={100}
                                            />
                                        </div>
                                        <div className="w-2/3">
                                            <MarqueeText className="text-sm" text="Mission: Impossible - Fallout" />
                                            <span className="text-xs text-gray-500">147 MIN</span>
                                        </div>
                                    </div>
                                    <div className="mb-2 flex gap-x-2">
                                        <div className="w-1/3">
                                            <Image
                                                src="https://i.pinimg.com/originals/11/d5/25/11d52562a64c9da5e4674308f7b69924.jpg"
                                                alt="movie 1 image"
                                                width={500}
                                                height={500}
                                                className="size-12 rounded-md object-cover"
                                                quality={100}
                                            />
                                        </div>
                                        <div className="w-2/3">
                                            <MarqueeText className="text-sm" text="Mission: Impossible - Fallout" />
                                            <span className="text-xs text-gray-500">147 MIN</span>
                                        </div>
                                    </div>
                                    <div className="mb-2 flex gap-x-2">
                                        <div className="w-1/3">
                                            <Image
                                                src="https://i.pinimg.com/originals/11/d5/25/11d52562a64c9da5e4674308f7b69924.jpg"
                                                alt="movie 1 image"
                                                width={500}
                                                height={500}
                                                className="size-12 rounded-md object-cover"
                                                quality={100}
                                            />
                                        </div>
                                        <div className="w-2/3">
                                            <MarqueeText className="text-sm" text="Mission: Impossible - Fallout" />
                                            <span className="text-xs text-gray-500">147 MIN</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            )}
        </section>
    );
};

export default FavoritesPage;
