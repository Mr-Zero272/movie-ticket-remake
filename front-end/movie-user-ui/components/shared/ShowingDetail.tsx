'use client';
import { format } from 'date-fns';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { cn, formatCurrencyVND } from '@/lib/utils';
import { fetchShowings } from '@/services/movieServices';
import { Frown, MoveRight } from 'lucide-react';
import { Button } from '../ui/button';
import DatePickerCustom from '../ui/date-picker-custom';
import { Skeleton } from '../ui/skeleton';

import { ShowingDto } from '@/types/showing';

type Props = {
    movieId: number;
    isUserSignIn?: boolean;
};

const ShowingDetail = ({ movieId, isUserSignIn = false }: Props) => {
    const router = useRouter();
    const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0] + 'T00:00:00');
    const [showings, setShowings] = useState<ShowingDto[] | null>(null);
    const [activeShowing, setActiveShowing] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchApi = async () => {
            const res = await fetchShowings(activeDate, movieId);
            setShowings(res);

            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };

        fetchApi();
    }, [activeDate, movieId]);

    const handleChooseDate = (date: string) => {
        setActiveShowing(0);
        setActiveDate(date);
    };

    const handleChooseShowing = (showingId: number) => {
        setActiveShowing(showingId);
    };

    const handleBooking = () => {
        if (!isUserSignIn) {
            toast.info('Sign in is required', {
                description: 'You have to sign to booking!',
                action: {
                    label: 'Sign in now',
                    onClick: () => router.push('/sign-in'),
                },
            });
            return;
        }
        router.push(`/showing/${activeShowing}`);
    };

    return (
        <div className="mb-5">
            <h1 className="mb-5 text-xl">Showings</h1>
            <DatePickerCustom initialDate={activeDate} onChooseDate={handleChooseDate} />
            <div className="mb-4">
                {showings &&
                    !loading &&
                    (showings.length === 0 ? (
                        <p className="text-gray-500">
                            This date does not have any showings. <Frown className="inline-block" />
                        </p>
                    ) : (
                        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
                            {showings.map((showing) => (
                                <div
                                    key={showing.id}
                                    className={cn(
                                        'cursor-pointer rounded-lg border border-gray-500 p-4 text-center hover:border-primary',
                                        { 'border-2 border-primary': showing.id === activeShowing },
                                    )}
                                    onClick={() => handleChooseShowing(showing.id)}
                                >
                                    <p className="text-sm uppercase text-gray-500 max-lg:text-xs">
                                        {showing.type} - {format(showing.startTime, 'h:mm a')}
                                    </p>
                                    <p className="text-2xl font-semibold text-primary max-lg:text-xl">
                                        {formatCurrencyVND(showing.priceEachSeat)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                {loading && (
                    <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
                        <div
                            className={`item-center flex h-20 flex-col items-center rounded-lg border border-gray-500 p-4`}
                        >
                            <div className="flex gap-x-3">
                                <Skeleton className="mb-2 h-4 w-20 max-sm:w-14" />{' '}
                                <Skeleton className="mb-2 h-4 w-12 max-sm:w-6" />
                            </div>
                            <Skeleton className="h-4 w-36 text-2xl font-semibold text-primary max-sm:w-24" />
                        </div>
                        <div className={`item-center flex flex-col items-center rounded-lg border border-gray-500 p-4`}>
                            <div className="flex gap-x-3">
                                <Skeleton className="mb-2 h-4 w-20 max-sm:w-14" />{' '}
                                <Skeleton className="mb-2 h-4 w-12 max-sm:w-6" />
                            </div>
                            <Skeleton className="h-4 w-36 text-2xl font-semibold text-primary max-sm:w-24" />
                        </div>
                        <div className={`item-center flex flex-col items-center rounded-lg border border-gray-500 p-4`}>
                            <div className="flex gap-x-3">
                                <Skeleton className="mb-2 h-4 w-20 max-sm:w-14" />{' '}
                                <Skeleton className="mb-2 h-4 w-12 max-sm:w-6" />
                            </div>
                            <Skeleton className="h-4 w-36 text-2xl font-semibold text-primary max-sm:w-24" />
                        </div>
                        <div className={`item-center flex flex-col items-center rounded-lg border border-gray-500 p-4`}>
                            <div className="flex gap-x-3">
                                <Skeleton className="mb-2 h-4 w-20 max-sm:w-14" />{' '}
                                <Skeleton className="mb-2 h-4 w-12 max-sm:w-6" />
                            </div>
                            <Skeleton className="h-4 w-36 text-2xl font-semibold text-primary max-sm:w-24" />
                        </div>
                    </div>
                )}
            </div>
            <div>
                <Button disabled={activeShowing === 0} onClick={handleBooking}>
                    Booking now <MoveRight className="ml-5" />
                </Button>
            </div>
        </div>
    );
};

export default ShowingDetail;
