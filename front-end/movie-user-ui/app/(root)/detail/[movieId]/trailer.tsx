'use client';

import { cn } from '@/lib/utils';
import { addToFavorite, deleteFavoriteMovie } from '@/services/favoriteServices';
import { Genre, UserFavoriteMovie } from '@/types/movie';
import { ChevronLeft, Heart, PauseCircle, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
    movieId: number;
    userId: string;
    userFavoriteMovies: UserFavoriteMovie[];
    backdropPath: string;
    video: string;
    title: string;
    genres: Genre[];
};

function Trailer({ backdropPath, video, title, genres, userFavoriteMovies, userId, movieId }: Props) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playVideo, setPlayVideo] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoved, setIsLoved] = useState(() => {
        return userFavoriteMovies.some((m) => m.userId === userId);
    });

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [video]);

    const handlePlayVideo = () => {
        setPlayVideo(!playVideo);
        if (videoRef.current) {
            if (!playVideo) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(false);
    };

    const handleMouseLeave = () => {
        setIsHovered(true);
    };

    const handleLoveClick = async () => {
        if (isLoved) {
            await deleteFavoriteMovie({ movieId: movieId, userId: userId });
        } else {
            await addToFavorite({ movieId: movieId, userId: userId });
        }
        setIsLoved((prev) => !prev);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="relative mb-5 h-96 w-full">
            <div
                className="h-full w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    borderImage: 'fill 0 linear-gradient(#0001, #000)',
                }}
            >
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    preload="metadata"
                    loop
                    poster={backdropPath}
                >
                    <source src={video === '' ? '/assets/default-video.mp4' : video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div
                    className={`absolute left-2/4 top-2/4 flex -translate-x-2/4 -translate-y-2/4 cursor-pointer flex-col items-center justify-center text-white ${playVideo ? 'hidden' : ''}`}
                    onClick={handlePlayVideo}
                >
                    <PlayCircle className="size-10" />
                    <span>Watch trailer</span>
                </div>
                <div
                    className={cn(
                        'absolute left-2/4 top-2/4 flex -translate-x-2/4 -translate-y-2/4 cursor-pointer flex-col items-center justify-center text-white',
                        { hidden: !playVideo, 'opacity-0 transition-all duration-1000 ease-linear': isHovered },
                    )}
                    onClick={handlePlayVideo}
                >
                    <PauseCircle className="size-10" />
                    <span>Stop</span>
                </div>
            </div>
            <div className="absolute top-5 flex w-full justify-between px-5 text-3xl text-gray-500">
                <button
                    onClick={handleBack}
                    className="rounded-full p-2 hover:bg-gray-200/20 hover:text-white active:scale-90"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={handleLoveClick}
                    className="rounded-full p-2 hover:bg-gray-200/20 hover:text-red-500 active:scale-90"
                >
                    <Heart className={cn('size-5', { 'animate-love fill-red-500 text-red-500': isLoved })} />
                </button>
            </div>
            <div className="absolute bottom-6 left-10 text-white">
                <h4 className="mb-3 text-2xl">{title}</h4>
                {genres && (
                    <ul className="flex list-none gap-x-2 font-thin">
                        {genres.slice(0, 3).map((genre) => (
                            <li key={genre.id} className="rounded-lg border border-white px-2 py-1 text-sm">
                                {genre.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Trailer;
