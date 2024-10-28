'use client';
import { cn } from '@/lib/utils';
import { addToFavorite, deleteFavoriteMovie } from '@/services/favoriteServices';
import { Ellipsis, Heart, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type Props = {
    userId: string;
    movieId: number;
    poster: string;
    title: string;
    runtime: number;
    firstGenre: string;
    love: boolean;
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

    const { userId, movieId, poster, title, runtime, firstGenre, className, love } = props;
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
                <div className="absolute inset-0 hidden h-72 w-full items-center justify-center bg-gray-700 bg-opacity-35 group-hover:flex">
                    <Link
                        href={`/detail/${movieId}`}
                        className="flex size-12 items-center justify-center rounded-full bg-white"
                    >
                        <Play className="size-5 fill-black dark:text-black" />
                    </Link>
                </div>
            </div>
            <div className="px-3 py-5 text-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="line-clamp-2 flex-1 font-bold">{title}</h3>
                    <Heart
                        className={cn('size-5 w-1/5 cursor-pointer text-red-500', {
                            'fill-red-500 text-red-500': isFavorite,
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
