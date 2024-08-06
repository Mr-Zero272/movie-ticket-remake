package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import org.springframework.stereotype.Service;

@Service
public interface MovieService {
    public PaginationResponse<Movie> getAllMovies(int page, int size);
    public Movie getMovieById(int id);
    public Movie addMovie(MovieRequest movie);
    public Movie updateMovie(int id, MovieRequest movie);
    public Movie updateMovieScheduleDetail(int id, MovieRequest movie);
}
