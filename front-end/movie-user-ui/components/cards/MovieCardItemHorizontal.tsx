import { cn } from '@/lib/utils';
import { addToFavorite, deleteFavoriteMovie } from '@/services/favoriteServices';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'nextjs-toploader/app';
import { toast } from 'sonner';

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

const MovieCardItemHorizontal = (props: Props | { loading: boolean; className?: string }) => {
    const router = useRouter();
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
            <figure className={`flex w-full gap-x-5 ${className as string}`}>
                <div className="group relative flex-none cursor-pointer">
                    <Skeleton className="rounded-m size-14" />
                </div>
                <div className="text-sm">
                    <div className="my-2 flex items-center justify-between">
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex gap-x-5">
                        <div className="mb-3 flex items-center gap-x-3 text-xs text-gray-400">
                            <Skeleton className="h-3 w-14" />
                            <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                            <Skeleton className="h-3 w-14" />
                        </div>
                        <Heart className="size-4 animate-pulse cursor-pointer fill-gray-500 text-gray-500" />
                    </div>
                </div>
            </figure>
        );
    }

    const { userId, movieId, poster, title, runtime, firstGenre, className, love } = props;
    const handleLoveClick = async () => {
        if (userId === '' || userId === '@') {
            toast.info('Sign in is required', {
                description: 'You have to sign to do this action!',
                action: {
                    label: 'Sign in now',
                    onClick: () => router.push('/sign-in'),
                },
            });
            return;
        }
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
        <figure className={`flex w-full gap-x-5 ${className ? className : ''}`}>
            <div className="group relative flex-none cursor-pointer">
                <Image
                    src={poster}
                    alt="movie 1 image"
                    width={500}
                    height={500}
                    className="size-14 rounded-md object-cover"
                    quality={100}
                />
            </div>
            <div className="text-sm">
                <div className="mb-2 flex items-center justify-between">
                    <Link href={`/detail/${movieId}`}>
                        <h3 className="line-clamp-1 font-bold hover:underline">{title}</h3>
                    </Link>
                </div>
                <div className="flex gap-x-5">
                    <div className="mb-3 flex items-center gap-x-3 text-xs text-gray-400">
                        <span>{runtime} MIN</span>
                        <span className="h-3 w-[0.1rem] rounded-full bg-gray-400 dark:bg-white"></span>
                        <span>{firstGenre}</span>
                    </div>
                    <Heart
                        className={cn('size-4 cursor-pointer text-gray-500', {
                            'animate-love fill-red-500 text-red-500': isFavorite,
                        })}
                        onClick={handleLoveClick}
                    />
                </div>
            </div>
        </figure>
    );
};

export default MovieCardItemHorizontal;
