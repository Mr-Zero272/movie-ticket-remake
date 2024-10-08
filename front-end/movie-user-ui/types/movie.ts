import { z } from 'zod';

export const GenreSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const DetailShowingTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    showings: z.number(),
});

export const GallerySchema = z.object({
    id: z.number(),
    imgUrl: z.string(),
});

export const UserFavoriteMovieSchema = z.object({
    id: z.number(),
    userId: z.string(),
});

export const MovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    adult: z.boolean(),
    budget: z.number(),
    originalLanguage: z.string(),
    overview: z.string(),
    status: z.string(),
    video: z.string().default(''),
    posterPath: z.string(),
    backdropPath: z.string(),
    voteAverage: z.number(),
    voteCount: z.number(),
    runtime: z.number(),
    releaseDate: z.string(),
    deleteFlag: z.boolean(),
    genres: z.array(GenreSchema),
    monthToSchedule: z.number(),
    yearToSchedule: z.number(),
    totalShowings: z.number(),
    totalDateShowingsInMonth: z.number(),
    priceEachSeat: z.number(),
    detailShowingTypes: z.array(DetailShowingTypeSchema),
    galleries: z.array(GallerySchema),
    userFavoriteMovies: z.array(UserFavoriteMovieSchema).default([]),
});

export const FavoriteMovieDtosSchema = z.object({
    runtime: z.number(),
    id: z.number(),
    title: z.string(),
    movieId: z.number(),
    releaseDate: z.string(),
    posterPath: z.string(),
    dateAdded: z.string(),
});

export type FavoriteMovieDtos = z.infer<typeof FavoriteMovieDtosSchema>;

export type Movie = z.infer<typeof MovieSchema>;

export type DetailShowingType = z.infer<typeof DetailShowingTypeSchema>;

export type Genre = z.infer<typeof GenreSchema>;

export type Gallery = z.infer<typeof GenreSchema>;

export type UserFavoriteMovie = z.infer<typeof UserFavoriteMovieSchema>;
