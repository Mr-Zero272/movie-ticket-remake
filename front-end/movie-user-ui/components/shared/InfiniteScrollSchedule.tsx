'use client';
import { Showing } from '@/types/showing';
import { LoaderCircle, SearchX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import Image from 'next/image';
import { fetchScheduleShowings } from '@/services/movieServices';

import DatePickerCustom from '../ui/date-picker-custom';
import ScrollTopButton from './ScrollTopButton';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';

const InfiniteScrollSchedule = () => {
    const router = useRouter();
    const [data, setData] = useState<Showing[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(2);
    const [loadingState, setLoadingState] = useState(false);
    const loading = useRef(false);
    const [activeDate, setActiveDate] = useState(() => new Date().toISOString().split('T')[0] + 'T00:00:00');

    const fetchMoreData = useCallback(async () => {
        if (loading.current || !hasMore) return;
        setLoadingState(true);
        loading.current = true;
        const res = await fetchScheduleShowings(activeDate, index);
        if (res.page > res.totalPages) {
            setHasMore(false);
        }
        setData((prevData) => [...prevData, ...res.data]);
        setIndex((prevIndex) => prevIndex + 1);
        setLoadingState(false);
        loading.current = false;
    }, [index, loading, activeDate, hasMore]);

    const handleChooseDate = (date: string) => {
        const fetchData = async () => {
            setLoadingState(true);

            if (loading.current) return;
            loading.current = true;
            const res = await fetchScheduleShowings(date);
            setActiveDate(date);
            setIndex(2);
            setData(res.data);
            window.scrollTo(0, 0);
            loading.current = false;
            setLoadingState(false);
        };

        fetchData();
    };

    useEffect(() => {
        const fetchApi = async () => {
            setLoadingState(true);
            if (loading.current) return;
            loading.current = true;
            const res = await fetchScheduleShowings(activeDate);
            if (res.page > res.totalPages) {
                setHasMore(false);
            }
            setData(res.data);

            setLoadingState(false);

            loading.current = false;
        };
        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 150) {
                fetchMoreData();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [fetchMoreData]);

    return (
        <div className="container mx-auto px-5 pt-4">
            <ScrollTopButton />
            <DatePickerCustom
                className="sticky top-20 bg-white dark:bg-[#121212]"
                initialDate={new Date().toISOString().split('T')[0] + 'T00:00:00'}
                onChooseDate={handleChooseDate}
            />
            {data &&
                data.length !== 0 &&
                data.map((showing) => (
                    <div className="-my-8 divide-y-2 divide-gray-100" key={showing.id}>
                        <div className="flex flex-wrap py-8 md:flex-nowrap">
                            <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-48">
                                <span className="title-font font-semibold text-gray-700">DATE & TIME</span>
                                <span className="mt-1 text-sm text-gray-500">
                                    {format(showing.startTime, 'dd MMM yyyy - h:mm a')}
                                </span>
                            </div>
                            <div className="flex gap-x-5 md:flex-grow">
                                <Image
                                    src={showing.movie.posterPath}
                                    alt="poster"
                                    width={150}
                                    height={300}
                                    className="h-56 rounded-md"
                                />
                                <div>
                                    <Link href={`/detail/${showing.movie.id}`}>
                                        <h2 className="title-font mb-2 line-clamp-2 text-2xl font-medium text-gray-900 hover:underline dark:text-white">
                                            {showing.movie.title}
                                        </h2>
                                    </Link>
                                    <p className="mb-2 line-clamp-3 leading-relaxed">{showing.movie.overview}</p>
                                    <div className="mb-5 flex items-center gap-x-3 text-sm text-gray-400">
                                        <span>{showing.movie.runtime} MIN</span>
                                        <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                                        <span className="uppercase">
                                            {showing.movie.genres.length === 0
                                                ? 'unknown'
                                                : showing.movie.genres[0].name}
                                        </span>
                                    </div>
                                    <Button onClick={() => router.push(`/showing/${showing.id}`)}>
                                        Booking now
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="M12 5l7 7-7 7" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            {data && data.length === 0 && !loadingState && (
                <div className="flex flex-col items-center gap-y-3 text-center text-gray-500">
                    <SearchX strokeWidth={1} className="size-20 text-primary" />
                    <h2 className="text-3xl font-bold">Whoops!</h2>
                    <p>It seems like this date do not have any showings.</p>
                    <p>Please try another one.</p>
                </div>
            )}
            {loadingState && (
                <div className="flex justify-center py-3">
                    <LoaderCircle className="size-7 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
};

export default InfiniteScrollSchedule;
