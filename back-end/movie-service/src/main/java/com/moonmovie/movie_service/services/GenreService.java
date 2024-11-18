package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Genre;
import com.moonmovie.movie_service.responses.PaginationResponse;

public interface GenreService {
    public PaginationResponse<Genre> getAllGenres(String q, String sort, String sortOrder, int page, int size);
    public Genre addGenre(Genre genre);
    public Genre updateGenre(Genre genre, int genreId);

    Genre deleteGenre(int genreId);
}
