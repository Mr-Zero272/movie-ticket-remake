import { fetchRecommendMovies } from '@/services/movieServices';
import React from 'react';
import MovieCardItemVertical from '../cards/MovieCardItemVertical';

type Props = {
    className?: string;
    movieId: number;
    userId: string;
};

const RecommendMovies = async ({ movieId, userId, className }: Props) => {
    const listRecommendMovies = await fetchRecommendMovies(movieId);
    return (
        <div className={`${className ? className : ''}`}>
            <h3 className="mb-3 text-xl">Recommend movies</h3>
            <div className="grid grid-cols-5 gap-x-3 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2">
                {listRecommendMovies.map((movie) => (
                    <MovieCardItemVertical
                        key={movie.id}
                        className="max-[500px]:w-40 max-[420px]:w-36 max-[385px]:w-32 max-[370px]:w-28"
                        userId={userId}
                        movieId={movie.id}
                        poster={movie.posterPath}
                        title={movie.title}
                        runtime={movie.runtime}
                        overview={movie.overview}
                        releaseDate={movie.releaseDate}
                        firstGenre={movie.genres.length === 0 ? 'unknown' : movie.genres[0].name}
                        love={movie.userFavoriteMovies.some((m) => m.userId === userId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecommendMovies;
