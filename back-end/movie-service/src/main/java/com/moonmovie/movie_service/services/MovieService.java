package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.MovieDto;
import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.models.MovieStatistical;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.responses.ScheduleResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MovieService {
    /**
     * Get all movies
     *
     * @param query Query string from user
     * @param genreId Genre's id
     * @param originalLanguage Language
     * @param status Movie's status
     * @param sort Sort by
     * @param sortOrder Sort order desc or asc
     * @param page current page
     * @param size size of the page
     * @return PaginationResponse<Movie> list movies and pagination information
     */
    public PaginationResponse<Movie> getAllMovies(String query, Integer genreId, String originalLanguage, String status, String sort, String sortOrder, int page, int size);

    /**
     * Get popular movies
     *
     * @param page current page
     * @param size size of the page
     * @param sort Sort field
     * @param genreId Genre's id
     * @return PaginationResponse<Movie> list movies and pagination information
     */
    public PaginationResponse<Movie> getPopularMovies(int page, int size, String sort, Integer genreId);

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
     Movie updateMovie(int id, MovieRequest movie);

     void deleteMovie(int id);

     Movie updateMovieScheduleDetail(int id, MovieRequest movie);

     ScheduleResponse schedule(int month, int year, String role);

    PaginationResponse<Movie> getUpcomingMovies(int page, int size);

    MovieDto getMovieByShowingId(int showingId);

    List<Movie> getRecommendMoviesByMovieId(int movieId);

    List<MovieStatistical> getMovieStatistical(int year);

    List<MovieStatistical> getScheduleMovieStatistical(int year);

    void updateDataMovie();
}
