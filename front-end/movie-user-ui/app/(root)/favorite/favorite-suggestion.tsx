import MarqueeText from '@/components/ui/marquee-text';
import { Movie } from '@/types/movie';
import { ChevronRight, Heart, Play, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

type Props = {
    listSuggestMovie: Movie[];
    onClose: () => void;
};

const FavoriteSuggestion = ({ listSuggestMovie, onClose }: Props) => {
    const [activeMovie, setActiveMovie] = useState(listSuggestMovie[0]);
    const [listMovies, setListMovies] = useState(listSuggestMovie.slice(1));

    const handleChooseActiveMovie = (movieId: number) => {
        setActiveMovie((prev) => listSuggestMovie.filter((m) => m.id === movieId)[0]);
        setListMovies(listSuggestMovie.filter((m) => m.id !== movieId));
    };

    const handleNextMovieInQueue = () => {
        setActiveMovie(listMovies[0]);
        setListMovies(() => {
            let newList = listMovies.filter((m) => m.id !== listMovies[0].id);
            return [...newList, activeMovie];
        });
    };

    const formatter = new Intl.ListFormat('en', {
        style: 'long',
        type: 'conjunction',
    });

    return (
        <article className="max-h-[33rem] min-h-96 w-64 flex-none overflow-scroll rounded-lg px-5 dark:bg-[#121212] max-[1200px]:hidden">
            <div className="sticky top-0 z-50 mb-3 flex items-center justify-between bg-white py-2 dark:bg-[#121212]">
                <h1 className="font-bold">Popular Movies</h1>
                <X
                    className="size-8 cursor-pointer rounded-full p-1.5 hover:bg-accent active:text-gray-500 dark:text-white dark:active:text-gray-400"
                    onClick={onClose}
                />
            </div>
            <div className="">
                <div className="relative mb-3">
                    <Image
                        src={activeMovie.posterPath}
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
                    <div className="w-full">
                        <MarqueeText className="text-lg font-bold" text={activeMovie.title} duration={5} />
                        <MarqueeText
                            className="text-sm text-gray-500"
                            text={formatter.format(activeMovie.genres.map((g) => g.name))}
                            duration={3}
                        />
                    </div>
                    <Heart className="size-5" />
                </div>
                <div className="mt-2 p-2">
                    <div className="rounded-md p-3 dark:bg-[#1f1f1f]">
                        <div className="flex justify-between">
                            <p>Next in queue</p>
                            <ChevronRight
                                className="size-7 cursor-pointer rounded-full bg-accent p-1.5"
                                onClick={handleNextMovieInQueue}
                            />
                        </div>
                        <div className="mt-3 overflow-hidden">
                            {listMovies.map((movie) => (
                                <div
                                    className="mb-2 flex cursor-pointer gap-x-2"
                                    key={movie.id}
                                    onClick={() => handleChooseActiveMovie(listMovies[0].id)}
                                >
                                    <div className="w-1/3">
                                        <Image
                                            src={movie.posterPath}
                                            alt="movie 1 image"
                                            width={500}
                                            height={500}
                                            className="size-12 rounded-md"
                                            quality={100}
                                        />
                                    </div>
                                    <div className="w-2/3">
                                        <MarqueeText className="text-sm" text={movie.title} duration={3} />
                                        <span className="text-xs text-gray-500">{movie.runtime} MIN</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default FavoriteSuggestion;
