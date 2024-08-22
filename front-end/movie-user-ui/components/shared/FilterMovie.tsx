'use client';
import { Genre, Movie } from '@/types/movie';
import React, { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import MovieCardItemVertical from '../cards/MovieCardItemVertical';
import { PaginationMovie } from '@/types/pagination';
import { fetchPopularMovies } from '@/services/movieServices';

interface Props {
    initialData: PaginationMovie;
    type: 'popular' | 'normal';
}

interface PropsWithSort extends Props {
    sort: boolean;
    sortData: string[];
}

interface PropsWithGenre extends Props {
    genre: boolean;
    genreData: Genre[];
}

interface PropsWithSortAndGenre extends Props, PropsWithSort, PropsWithSort {}

const FilterMovie = (props: PropsWithGenre | PropsWithSort | PropsWithSortAndGenre) => {
    const [sort, setSort] = useState('releaseDate');
    const [genre, setGenre] = useState('');
    const [movieData, setMovieData] = useState(props.initialData);
    const [loading, setLoading] = useState(false);
    const isFirstTimeRun = useRef(false);

    useEffect(() => {
        if (isFirstTimeRun.current) {
            const fetchMovie = async () => {
                setLoading(true);
                const res = await fetchPopularMovies({ size: 10, page: 1, sort, genre });
                setMovieData(res);
                setLoading(false);
            };

            fetchMovie();
            return;
        }

        isFirstTimeRun.current = true;
    }, [genre, sort]);

    return (
        <div>
            <div className="mb-5 grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                {'sort' in props && sort && (
                    <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                        <label htmlFor="choose-date" className="mb-3 text-xs text-gray-400">
                            SORT
                        </label>
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger
                                className="no-focus border-none bg-transparent outline-none"
                                id="choose-date"
                            >
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="border-none outline-none">
                                {props.sortData.map((sort) => (
                                    <SelectItem key={sort} value={sort} className="capitalize">
                                        {sort}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {'genre' in props && genre && (
                    <div className="w-56 max-[500px]:w-48 max-[420px]:w-44 max-[385px]:w-40">
                        <label htmlFor="choose-cinema-type" className="mb-3 text-xs text-gray-400">
                            CHOOSE GENRE
                        </label>
                        <Select value={genre} onValueChange={setGenre}>
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
                )}
            </div>
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
                            movieId={movie.id}
                            poster={movie.posterPath}
                            title={movie.title}
                            runtime={movie.runtime}
                            firstGenre={movie.genres[0].name}
                        />
                    ))
                ) : (
                    <div>No result...</div>
                )}
            </div>
        </div>
    );
};

export default FilterMovie;
