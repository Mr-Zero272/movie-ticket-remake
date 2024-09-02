'use client';

import MovieCardItemHorizontal from '@/components/cards/MovieCardItemHorizontal';
import MarqueeText from '@/components/ui/marquee-text';
import SearchInputHidden from '@/components/ui/search-hidden-input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { timeAgo } from '@/lib/utils';
import { FavoriteMovieDtos, Movie } from '@/types/movie';
import { Heart, Logs, Play, SearchX, SquareChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import FavoriteSuggestion from './favorite-suggestion';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
    username: string;
    userId: string;
    listPopularMovies: Movie[];
    listFavoriteMovies: FavoriteMovieDtos[];
};

type SortField = 'sort' | 'title' | 'dateAdded' | 'duration';

const FavoriteMain = ({ username, userId, listFavoriteMovies, listPopularMovies }: Props) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSideOpen, setIsSideOpen] = useState(true);
    const [listMovie, setListMovie] = useState<FavoriteMovieDtos[]>(listFavoriteMovies);
    const [sortField, setSortField] = useState('sort');

    const handleOpenSide = () => {
        setIsSideOpen((prev) => !prev);
    };

    const filterFavoriteMovie = (searchValue: string, sortField: string) => {
        if (searchValue === '') {
            if (sortField === 'sort') {
                setListMovie(listFavoriteMovies);
            } else {
                setListMovie(
                    listFavoriteMovies.sort((a, b) => {
                        const nameA = a.title.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.title.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    }),
                );
            }
        } else {
            if (sortField === 'sort') {
                setListMovie(
                    listFavoriteMovies.filter((m) => {
                        return m.title.toLowerCase().includes(searchValue.toLowerCase());
                    }),
                );
            } else {
                setListMovie(
                    listFavoriteMovies
                        .filter((m) => {
                            return m.title.toLowerCase().includes(searchValue.toLowerCase());
                        })
                        .sort((a, b) => {
                            const nameA = a.title.toUpperCase(); // ignore upper and lowercase
                            const nameB = b.title.toUpperCase(); // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        }),
                );
            }
        }
    };

    const handleSearchValueChange = (value: string) => {
        setSearchValue(value);
        filterFavoriteMovie(value, sortField);
    };

    const handleSortChange = (sort: string) => {
        setSortField(sort);
        filterFavoriteMovie(searchValue, sort);
    };

    return (
        <>
            <div className="relative flex gap-x-2 p-4">
                <article className="max-h-[33rem] min-h-96 flex-1 overflow-scroll rounded-lg">
                    <div className="flex h-56 items-end gap-x-5 rounded-t-lg bg-[#0093E9] bg-[linear-gradient(160deg,#0093E9_0%,#80D0C7_100%)] p-5">
                        <div className="w-fit rounded-md bg-[#0093E9] bg-[linear-gradient(160deg,#0093E9_0%,#80D0C7_50%,#ffffff_100%)] p-16 max-md:p-10">
                            <Heart className="size-14 fill-white text-white dark:fill-black dark:text-black" />
                        </div>
                        <div>
                            <p className="text-sm text-white dark:text-black">List</p>
                            <h2 className="text-5xl font-bold text-white dark:text-black max-md:text-xl">
                                Liked Movies
                            </h2>
                            <p className="text-sm text-white dark:text-black">
                                <span>{username}</span> - <span>{listFavoriteMovies.length} movie(s)</span>
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center justify-end gap-x-5">
                            {listFavoriteMovies.length !== 0 && (
                                <>
                                    <SearchInputHidden
                                        value={searchValue}
                                        onChange={handleSearchValueChange}
                                        widthResponsive="max-md:w-32"
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-x-2">
                                                <p className="capitalize">{sortField}</p> <Logs />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={sortField} onValueChange={handleSortChange}>
                                                <DropdownMenuRadioItem value="sort">None</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                                                {/* <DropdownMenuRadioItem value="dateAdded">Date added</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="duration">Duration</DropdownMenuRadioItem> */}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                            <div className="max-[1200px]:hidden">
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <SquareChevronRight className="cursor-pointer" onClick={handleOpenSide} />
                                        </TooltipTrigger>
                                        <TooltipContent className="dark:border-none">
                                            <p>Open popular movie</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <div className="">
                            {listMovie.length !== 0 ? (
                                <Table>
                                    <TableCaption>A list of your favorite movies.</TableCaption>
                                    <TableHeader className="sticky top-0">
                                        <TableRow>
                                            <TableHead className="w-10 max-[450px]:hidden">#</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead className="max-sm:hidden">Date added</TableHead>
                                            <TableHead className="text-right max-[450px]:hidden">Duration</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listMovie.map((movie, index) => (
                                            <TableRow key={movie.id}>
                                                <TableCell className="font-medium max-[450px]:hidden">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <MovieCardItemHorizontal
                                                        movieId={movie.movieId}
                                                        userId={userId}
                                                        title={movie.title}
                                                        poster={movie.posterPath}
                                                        runtime={movie.runtime}
                                                        firstGenre={format(movie.releaseDate, 'dd MMM')}
                                                        love={true}
                                                    />
                                                </TableCell>
                                                <TableCell className="max-sm:hidden">
                                                    {timeAgo(movie.dateAdded)}
                                                </TableCell>
                                                <TableCell className="text-right max-[450px]:hidden">
                                                    {movie.runtime}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center gap-y-3 text-center text-gray-500">
                                    <SearchX strokeWidth={1} className="size-20 text-primary" />
                                    <h2 className="text-3xl font-bold">Whoops!</h2>
                                    <p>It seems like you do not have any favorite movies here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
                {isSideOpen && <FavoriteSuggestion listSuggestMovie={listPopularMovies} onClose={handleOpenSide} />}
            </div>
        </>
    );
};

export default FavoriteMain;
