package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MovieService {
    /**
     * Get all movies
     *
     * @param query Query string from user
     * @param page current page
     * @param size size of the page
     * @return PaginationResponse<Movie> list movies and pagination information
     */
    public PaginationResponse<Movie> getAllMovies(String query, int page, int size);

    /**
     * Get popular movies
     *
     * @param page current page
     * @param size size of the page
     * @return PaginationResponse<Movie> list movies and pagination information
     */
    public PaginationResponse<Movie> getPopularMovies(int page, int size);

    /**
     * Get a movie by id
     *
     * @param id Movie's id
     * @return Movie information
     */
    public Movie getMovieById(int id);

    /**
     * Add new movie
     *
     * @param movie Movie information
     * @return Movie information after add to the database
     */
    public Movie addMovie(MovieRequest movie);

    /**
     * Update a movie
     *
     * @param movie Movie information
     * @return Movie information after update in the database
     */
    public Movie updateMovie(int id, MovieRequest movie);

    public Movie updateMovieScheduleDetail(int id, MovieRequest movie);

    public ResponseTemplate schedule(int month, int year, String role);
}
