'use client';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { ChevronLeft, Flag, Pencil, PencilLine, ScanLine } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';

import { Ticket } from '@/types/ticket';
import { Movie } from '@/types/movie';
import { Fragment, useEffect, useState } from 'react';
import { SeatDetail } from '@/types/seat';
import { changeSeatPosition, fetchSeatDetails } from '@/services/seatServices';
import SeatSectionSkeleton from '@/components/ui/seat-section-skeletion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Props = {
    userId: string;
    listPopularMovies: Movie[];
    activeTicket: Ticket | null;
    onUpdatePosition: (s: SeatDetail, ticketId: string) => void;
};

const DetailTicket = ({ activeTicket, userId, listPopularMovies, onUpdatePosition }: Props) => {
    const [seatData, setSeatData] = useState<Array<SeatDetail>>([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [activeSeat, setActiveSeat] = useState('');
    const [tab, setTab] = useState<'active' | 'position' | 'popular'>(() => {
        if (activeTicket) {
            return 'active';
        } else {
            return 'popular';
        }
    });

    useEffect(() => {
        setActiveSeat(() => {
            if (activeTicket) {
                return activeTicket.seatId;
            } else {
                return '';
            }
        });
        setErrorMsg('');
        const fetchSeats = async () => {
            if (!activeTicket) return;
            if (activeTicket.status === 'unpaid') {
                setTab('active');
                return;
            }
            setLoading(true);
            let res = await fetchSeatDetails(activeTicket.showingId);
            res = res.map((s) => {
                if (s.id === activeTicket.seatId && s.userId === userId) {
                    return {
                        ...s,
                        status: 'available',
                    };
                } else {
                    return s;
                }
            });
            setSeatData(res);
            setLoading(false);
        };

        fetchSeats();
    }, [activeTicket, userId]);

    const handleChangePosition = () => {
        setTab('position');
    };

    const handleChooseSeat = (seatId: string, status: string) => {
        if (status === 'booked') return;
        setActiveSeat(seatId);
    };

    const handleSubmitChangePosition = async () => {
        if (!activeTicket) return;
        if (activeTicket.seatId === activeSeat) return;
        setSubmitLoading(true);
        const res = await changeSeatPosition({
            startTime: activeTicket.date,
            oldPosition: activeTicket.seatId,
            newPosition: activeSeat,
        });
        if ('httpStatusCode' in res) {
            setErrorMsg(res.message);
        } else {
            toast.success('Update seat position successfully!');
            onUpdatePosition(res, activeTicket.id);
            setTab('active');
        }
        setSubmitLoading(false);
    };

    const router = useRouter();
    return (
        <>
            {tab === 'active' && activeTicket && (
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
                        <Button size="sm" variant="link" onClick={() => router.push(`/order/${activeTicket.orderId}`)}>
                            <ScanLine className="me-2 size-4" />
                            Order detail
                        </Button>
                        {activeTicket && activeTicket.status === 'paid' && (
                            <Button size="sm" variant="link" onClick={handleChangePosition}>
                                <PencilLine className="me-2 size-4" />
                                Position
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {tab === 'popular' && (
                <div>
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
            {tab === 'position' && (
                <div>
                    <div className="mb-5 flex w-fit cursor-pointer items-center gap-x-2">
                        <div
                            className="w-fit rounded-md p-1.5 hover:bg-accent active:scale-90"
                            onClick={() => setTab('active')}
                        >
                            <ChevronLeft className="size-6" />
                        </div>
                        <p>Back</p>
                    </div>
                    <p className="mb-5 text-sm text-gray-500">
                        You can change your seat if the show is still 3 days away. It is our policy, please understand.
                    </p>
                    <div className="mb-5">
                        {loading && <SeatSectionSkeleton />}
                        {!loading && seatData?.length !== 0 && (
                            <Fragment>
                                <div className="mb-7 flex flex-col items-center justify-center">
                                    <div className="h-1 w-56 rounded-full bg-gray-400 shadow-lg"></div>
                                    <p className="text-primary">SCREEN</p>
                                </div>
                                <div className="flex flex-col items-center gap-0.5">
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(0, 8).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,
                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(8, 18).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,
                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(18, 30).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(30, 42).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(42, 56).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(56, 70).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(70, 84).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(84, 98).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(98, 110).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-0.5">
                                        {seatData.slice(110, 120).map((s) => {
                                            const active = activeSeat === s.id;
                                            let booked = s.status === 'booked';

                                            return (
                                                <div
                                                    key={s.id}
                                                    className={cn('size-4 cursor-pointer rounded-sm border', {
                                                        'reserved-seat': booked,

                                                        'available-seat': !active,
                                                        'your-seat cursor-pointer': active,
                                                    })}
                                                    onClick={() => handleChooseSeat(s.id, s.status)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </Fragment>
                        )}
                        {!loading && seatData?.length === 0 && (
                            <div className="mx-auto grid place-items-center px-8 text-center">
                                <div>
                                    <Flag className="mx-auto size-10" />
                                    <h1 color="blue-gray" className="mt-5 text-xl leading-snug md:text-2xl">
                                        Error 400 <br />
                                        <br /> It looks like there was no showing.
                                    </h1>
                                    <p className="mx-auto mb-5 mt-8 text-[18px] font-normal text-gray-500 md:max-w-sm">
                                        Please try another date.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mb-4 flex justify-center gap-5">
                        <div className="flex items-center gap-x-2">
                            <div className="your-seat size-4 rounded-sm border"></div>
                            <p>Your seat(s)</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <div className="reserved-seat size-4 rounded-sm border"></div>
                            <p>Reserved</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        {errorMsg !== '' && <p className="mb-1 line-clamp-2 text-sm italic text-red-500">{errorMsg}</p>}
                        <Button
                            size="sm"
                            loading={submitLoading}
                            disabled={submitLoading}
                            onClick={handleSubmitChangePosition}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailTicket;
