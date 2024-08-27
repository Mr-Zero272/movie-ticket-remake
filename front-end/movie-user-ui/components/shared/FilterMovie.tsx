'use client';
import { paginate } from '@/lib/utils';
import { fetchMovies, fetchPopularMovies } from '@/services/movieServices';
import { Genre } from '@/types/movie';
import { PaginationMovie } from '@/types/pagination';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import MovieCardItemVertical from '../cards/MovieCardItemVertical';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Select = {
    label: string;
    value: string;
};

interface Props {
    userId: string;
    sortData: Select[];
    genreData: Genre[];
    initialData: PaginationMovie;
}

interface PropsWithTypeNormal extends Props {
    languageData: Select[];
    statusData: Select[];
    sizeData: Select[];
    type: 'normal';
    pagination: boolean;
}

interface PropsWithTypePopular extends Props {
    type: 'popular';
}

const FilterMovie = (props: PropsWithTypeNormal | PropsWithTypePopular) => {
    const params = useParams();
    let q = decodeURI(params?.q as string);

    const [sort, setSort] = useState(props.sortData[0].value);
    const [genreId, setGenreId] = useState(props.genreData[0].id.toString());
    const [page, setPage] = useState(props.initialData.page);
    const [size, setSize] = useState(props.initialData.size);
    const [movieData, setMovieData] = useState(props.initialData);
    const [loading, setLoading] = useState(false);
    const isFirstTimeRun = useRef(false);
    const [language, setLanguage] = useState('languageData' in props ? props.languageData[0].value : '');
    const [status, setStatus] = useState('statusData' in props ? props.statusData[0].value : '');

    useEffect(() => {
        if (isFirstTimeRun.current) {
            const fetchMovieWithTypePopular = async () => {
                setLoading(true);
                const res = await fetchPopularMovies({ size, page, sort, genreId: +genreId });
                setMovieData(res);
                setLoading(false);
            };

            const fetchMovieWithTypeNormal = async () => {
                setLoading(true);
                if (q === undefined || q === null || q === 'undefined') {
                    q = '';
                }
                const res = await fetchMovies({
                    q,
                    originalLanguage: language,
                    status,
                    sort,
                    genreId,
                    page,
                    size,
                });
                setMovieData(res);
                setLoading(false);
            };

            if (props.type === 'popular') {
                fetchMovieWithTypePopular();
            } else {
                fetchMovieWithTypeNormal();
            }
            return;
        }

        isFirstTimeRun.current = true;
    }, [q, language, status, page, size, genreId, sort]);

    const { current, prev, next, items } = useMemo(() => {
        return paginate({ current: movieData.page, max: movieData.totalPages });
    }, [movieData.page, movieData.totalPages]);

    return (
        <div>
            <div className="mb-5 grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                    <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                        SORT
                    </label>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="no-focus border-none bg-transparent outline-none" id="choose-date">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="border-none outline-none">
                            {props.sortData.map((sort) => (
                                <SelectItem key={sort.value} value={sort.value} className="capitalize">
                                    {sort.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                    <label htmlFor="choose-cinema-type" className="mb-3 text-xs text-gray-400">
                        CHOOSE GENRE
                    </label>
                    <Select value={genreId} onValueChange={setGenreId}>
                        <SelectTrigger
                            className="no-focus border-none bg-transparent outline-none"
                            id="choose-cinema-type"
                        >
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="border-none outline-none">
                            {props.genreData.map((genre) => (
                                <SelectItem key={genre.id} value={genre.id.toString()} className="capitalize">
                                    {genre.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {'languageData' in props && (
                    <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                        <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                            Language
                        </label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger
                                className="no-focus border-none bg-transparent outline-none"
                                id="choose-date"
                            >
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="border-none outline-none">
                                {props.languageData.map((language) => (
                                    <SelectItem key={language.value} value={language.value} className="capitalize">
                                        {language.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {'statusData' in props && (
                    <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                        <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                            Status
                        </label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger
                                className="no-focus border-none bg-transparent outline-none"
                                id="choose-date"
                            >
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="border-none outline-none">
                                {props.statusData.map((status) => (
                                    <SelectItem key={status.value} value={status.value} className="capitalize">
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {'sizeData' in props && (
                    <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                        <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                            Size
                        </label>
                        <Select value={size.toString()} onValueChange={(value) => setSize(+value)}>
                            <SelectTrigger
                                className="no-focus border-none bg-transparent outline-none"
                                id="choose-date"
                            >
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="border-none outline-none">
                                {props.sizeData.map((siz) => (
                                    <SelectItem key={siz.value} value={siz.value} className="capitalize">
                                        {siz.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            {'pagination' in props && (
                <Pagination className="mb-5 md:hidden">
                    <PaginationContent className="flex flex-wrap justify-center">
                        <PaginationItem>
                            <PaginationPrevious
                                className="cursor-pointer select-none"
                                onClick={() => {
                                    if (prev !== null) {
                                        setPage(prev);
                                    }
                                }}
                            />
                        </PaginationItem>
                        {items.map((items, index) => {
                            if (items === '...') {
                                return (
                                    <PaginationItem
                                        className="cursor-not-allowed select-none"
                                        key={index}
                                        onClick={() => {}}
                                    >
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return (
                                <PaginationItem className="cursor-pointer select-none" key={index}>
                                    <PaginationLink isActive={+items === page} onClick={() => setPage(+items)}>
                                        {items}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        <PaginationItem>
                            <PaginationNext
                                className="cursor-pointer select-none"
                                onClick={() => {
                                    if (next !== null) {
                                        setPage(next);
                                    }
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
            <div className="grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                {loading ? (
                    <>
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                        <MovieCardItemVertical loading />
                    </>
                ) : movieData.data.length !== 0 ? (
                    movieData.data.map((movie) => (
                        <MovieCardItemVertical
                            key={movie.id}
                            userId={props.userId}
                            movieId={movie.id}
                            poster={movie.posterPath}
                            title={movie.title}
                            runtime={movie.runtime}
                            firstGenre={movie.genres[0].name}
                            love={movie.userFavoriteMovies.some((m) => m.userId === props.userId)}
                        />
                    ))
                ) : (
                    <div>No result...</div>
                )}
            </div>
            {'pagination' in props && (
                <Pagination>
                    <PaginationContent className="flex flex-wrap justify-center">
                        <PaginationItem>
                            <PaginationPrevious
                                className="cursor-pointer select-none"
                                onClick={() => {
                                    if (prev !== null) {
                                        setPage(prev);
                                    }
                                }}
                            />
                        </PaginationItem>
                        {items.map((items, index) => {
                            if (items === '...') {
                                return (
                                    <PaginationItem
                                        className="cursor-not-allowed select-none"
                                        key={index}
                                        onClick={() => {}}
                                    >
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return (
                                <PaginationItem className="cursor-pointer select-none" key={index}>
                                    <PaginationLink isActive={+items === page} onClick={() => setPage(+items)}>
                                        {items}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        <PaginationItem>
                            <PaginationNext
                                className="cursor-pointer select-none"
                                onClick={() => {
                                    if (next !== null) {
                                        setPage(next);
                                    }
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default FilterMovie;
