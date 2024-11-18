'use client';
import { cn } from '@/lib/utils';
import { addToFavorite, deleteFavoriteMovie } from '@/services/favoriteServices';
import { CalendarDays, Ellipsis, Heart, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { HoverCard, HoverCardTrigger } from '../ui/hover-card';
import { HoverCardArrow, HoverCardContent } from '@radix-ui/react-hover-card';
import { format } from 'date-fns';

type Props = {
    userId: string;
    movieId: number;
    poster: string;
    title: string;
    runtime: number;
    firstGenre: string;
    love: boolean;
    overview: string;
    releaseDate: string;
    className?: string;
};

const MovieCardItemVertical = (props: Props | { loading: boolean; className?: string }) => {
    const isApiCall = useRef(false);
    const [isFavorite, setIsFavorite] = useState(() => {
        if ('love' in props) {
            return props.love;
        }
        return false;
    });

    if ('loading' in props) {
        const { className } = props;
        return (
            <figure className={`max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40 ${className as string}`}>
                <div className="group relative cursor-pointer">
                    <div className="h-72 w-full bg-gray-500" />
                </div>
                <div className="px-3 py-5 text-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Heart className="size-5 cursor-pointer fill-gray-500 text-gray-500" />
                    </div>
                    <div className="mb-3 flex items-center gap-x-3 text-xs text-gray-400">
                        <Skeleton className="h-3 w-14" />
                        <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                        <Skeleton className="h-3 w-14" />
                    </div>
                    <div>
                        <Ellipsis className="text-gray-400" />
                    </div>
                </div>
            </figure>
        );
    }

    const { userId, movieId, poster, title, runtime, firstGenre, className, overview, releaseDate } = props;
    let rlDate = releaseDate;
    if (!rlDate) {
        rlDate = new Date().toISOString();
    }

    const handleLoveClick = async () => {
        if (userId === '' || userId === '@') return;
        if (isApiCall.current) return;
        isApiCall.current = true;
        if (isFavorite) {
            await deleteFavoriteMovie({ movieId: movieId, userId: userId });
        } else {
            await addToFavorite({ movieId: movieId, userId: userId });
        }
        setIsFavorite((prev) => !prev);
        isApiCall.current = false;
    };

    return (
        <figure className={`max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40 ${className as string}`}>
            <div className="group relative cursor-pointer">
                <Image
                    src={poster}
                    alt="movie 1 image"
                    width={500}
                    height={500}
                    className="h-72 w-full"
                    quality={100}
                />
                <Link
                    href={`/detail/${movieId}`}
                    className="absolute inset-0 hidden h-72 w-full items-center justify-center bg-gray-700 bg-opacity-35 group-hover:flex"
                >
                    <HoverCard openDelay={400}>
                        <HoverCardTrigger asChild>
                            <div className="relative flex size-10 items-center justify-center rounded-full bg-white">
                                <Play className="size-5 fill-black dark:text-black" />
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="z-10 w-52" side="right" sideOffset={10}>
                            <HoverCardArrow className="fill-white" />
                            <div className="flex justify-between space-x-4 bg-white p-3">
                                <div className="space-y-1">
                                    <h4 className="line-clamp-2 text-sm font-bold">{title}</h4>
                                    <p className="line-clamp-4 text-sm text-gray-500">{overview}</p>
                                    <div className="flex items-center pt-2">
                                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                                        <span className="text-xs text-muted-foreground">
                                            Release {format(rlDate, 'MMMM yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </Link>
            </div>
            <div className="px-3 py-5 text-sm">
                <div className="mb-3 flex items-center justify-between">
                    <Link href={`/detail/${movieId}`}>
                        <h3 className="line-clamp-2 flex-1 font-bold hover:underline">{title}</h3>
                    </Link>
                    <Heart
                        className={cn('size-5 w-1/5 cursor-pointer text-gray-500', {
                            'animate-love fill-red-500 text-red-500': isFavorite,
                        })}
                        onClick={handleLoveClick}
                    />
                </div>
                <div className="mb-3 flex items-center gap-x-3 text-xs text-gray-400">
                    <span>{runtime} MIN</span>
                    <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                    <span className="uppercase">{firstGenre}</span>
                </div>
                <div>
                    <Ellipsis className="text-gray-400" />
                </div>
            </div>
        </figure>
    );
};

export default MovieCardItemVertical;
