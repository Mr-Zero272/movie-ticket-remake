'use client';
import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';
import { Button } from '@/components/ui/button';
import { formatCurrencyVND, formatMinutes } from '@/lib/utils';
import { Movie } from '@/types/movie';
import { Ticket } from '@/types/ticket';
import { format } from 'date-fns';
import { TicketIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';

type Props = {
    userId: string;
    listPopularMovies: Movie[];
    activeTicket: Ticket | null;
};

const DetailTicket = ({ activeTicket, userId, listPopularMovies }: Props) => {
    const router = useRouter();
    return (
        <>
            {activeTicket ? (
                <div className="min-h-96 w-1/3 flex-none rounded-lg bg-white p-4 dark:bg-black max-[1490px]:hidden">
                    <div className="flex justify-between gap-x-4 rounded-t-lg bg-[linear-gradient(to_right,#92fe9d_0%,#00c9ff_100%)] px-10 py-2 font-bold text-white dark:text-black">
                        <p>Moon Movie</p>
                        <TicketIcon className="text-gray-400" />
                        <p>Tickets</p>
                    </div>
                    <div className="relative rounded-b-lg bg-accent p-4 dark:bg-[#262626]">
                        <div className="flex justify-between gap-x-5">
                            <div>
                                <p className="text-sm text-gray-500">Movie</p>
                                <p className="font-bold">{activeTicket.movieTitle}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-bold">{format(activeTicket.date, 'dd MMM, yyyy - h:mm a')}</p>
                            </div>
                        </div>
                        <div className="my-5 border-b-2 border-dashed pt-5">
                            <div className="absolute -left-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                            <div className="absolute -right-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Seat</p>
                                <p className="font-bold">{activeTicket.seatNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Row</p>
                                <p className="font-bold">{activeTicket.seatRow}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Hall</p>
                                <p className="font-bold">{activeTicket.hall}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 rounded-lg bg-accent p-4 dark:bg-[#262626]">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-bold">{formatCurrencyVND(activeTicket.price)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Runtime</p>
                                <p className="font-bold">{formatMinutes(activeTicket.runtime)}</p>
                            </div>
                        </div>
                        <div className="my-3 flex items-center justify-between gap-x-5">
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="line-clamp-2 font-bold">{activeTicket.address}</p>
                        </div>
                        <div className="flex items-center justify-between gap-x-5">
                            <QRCode value={activeTicket.id} size={70} />
                            <p className="text-gray-500">Scan this code in front of the cinema hall to enter.</p>
                        </div>
                        <div className="mt-2 flex justify-end">
                            <Button onClick={() => router.push(`/order/${activeTicket.orderId}`)}>Order detail</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-96 w-1/3 flex-none rounded-lg bg-white p-4 dark:bg-black max-[1490px]:hidden">
                    <h2 className="w-fit border-b-2 border-b-primary text-2xl font-bold">Queue</h2>
                    <h3 className="mt-2 font-bold">Popular movies</h3>
                    <ul className="mt-5 max-h-[26rem] space-y-2 overflow-y-scroll">
                        {listPopularMovies.map((movie) => (
                            <MovieCardItemHorizontal
                                key={movie.id}
                                userId={userId}
                                movieId={movie.id}
                                poster={movie.posterPath}
                                title={movie.title}
                                runtime={movie.runtime}
                                firstGenre={movie.genres[0].name}
                                love={movie.userFavoriteMovies.some((s) => s.userId === userId)}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default DetailTicket;
