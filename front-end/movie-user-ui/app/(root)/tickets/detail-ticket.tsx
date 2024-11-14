'use client';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { ScanLine } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';

import { Ticket } from '@/types/ticket';
import { Movie } from '@/types/movie';

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
                    <div className="relative mt-10 h-[calc(100%_-_2.5rem)] rounded-lg bg-accent p-3 dark:bg-[#262626]">
                        <div className="flex gap-x-2">
                            <div className="relative w-1/3">
                                <Image
                                    src={activeTicket.moviePoster}
                                    alt="movie-poster"
                                    height={70}
                                    width={50}
                                    quality={100}
                                    className="relative bottom-10 h-32 w-28 rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="line-clamp-2 font-bold uppercase">{activeTicket.movieTitle}</h3>
                                <p className="text-sm text-gray-500">
                                    Created at: {format(activeTicket.createdAt, 'dd MMM, yyyy - HH:mm')}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Run time: <span className="font-medium text-black">{activeTicket.runtime} min</span>
                                </p>
                            </div>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="line-clamp-2 font-bold">{activeTicket.address}</p>
                        </div>
                        <div className="flex justify-between gap-x-5">
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-bold">{format(activeTicket.date, 'EEEE, dd MMM yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-bold">{format(activeTicket.date, 'HH:mm a')}</p>
                            </div>
                        </div>
                        <div className="my-5 border-b-2 border-dashed pt-2">
                            <div className="absolute -left-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                            <div className="absolute -right-4 -mt-4 size-8 rounded-full bg-white dark:bg-[#121212]"></div>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Seat</p>
                                <p className="font-bold">{activeTicket.seatNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Row</p>
                                <p className="font-bold">{activeTicket.seatRow}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Cinema</p>
                                <p className="font-bold">{activeTicket.hall}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-x-5">
                            <div className="border">
                                <QRCode value={activeTicket.id} size={70} />
                            </div>
                            <p className="text-gray-500">Scan this code in front of the cinema hall to enter.</p>
                        </div>

                        <div className="absolute -top-10 right-0">
                            <Button
                                size="sm"
                                variant="link"
                                onClick={() => router.push(`/order/${activeTicket.orderId}`)}
                            >
                                <ScanLine className="me-2 size-5" />
                                Order detail
                            </Button>
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
