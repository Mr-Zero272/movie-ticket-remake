package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import com.moonmovie.movie_service.dao.DetailShowingTypeDao;
import com.moonmovie.movie_service.dao.GenreDao;
import com.moonmovie.movie_service.dao.MovieDao;
import com.moonmovie.movie_service.exceptions.MovieException;
import com.moonmovie.movie_service.models.DetailShowingType;
import com.moonmovie.movie_service.models.Genre;
import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieDao movieDao;

    @Autowired
    private GenreDao genreDao;

    @Autowired
    private DetailShowingTypeDao detailShowingTypeDao;

    @Override
    public PaginationResponse<Movie> getAllMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Movie> pageMovie = movieDao.findAllByDeleteFlagIsFalse(pageable);
        PaginationResponse<Movie> resp = PaginationResponse.<Movie>builder()
                .data(pageMovie.getContent())
                .page(page)
                .size(size)
                .totalPages(pageMovie.getTotalPages())
                .totalElements(pageMovie.getTotalElements())
                .build();
        return resp;
    }

    @Override
    public Movie getMovieById(int id) {
        return movieDao.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Movie addMovie(MovieRequest request) {
        // Check if max showings in the month
        int totalShowingsThisMoth = movieDao.sumTotalShowings(request.getMonthToSchedule(), request.getYearToSchedule());
        if (totalShowingsThisMoth > 30 * 8 * 10) {
            throw new MovieException(MovieErrorConstants.ERROR_MAX_SHOWINGS_THIS_MONTH);
        }

        // Check if the movie has the same title
        if (movieDao.findByTitle(request.getTitle()).isPresent()) {
            throw new MovieException(MovieErrorConstants.ERROR_MOVIE_EXISTED);
        }

        Movie movie = convertMovieRequestToMovie(request);
        movie.setDetailShowingTypes(request.getDetailShowingTypes());
        Movie moveSaved = movieDao.save(movie);
        for (DetailShowingType detailShowingType : request.getDetailShowingTypes()) {
            detailShowingType.setMovie(movie);
            detailShowingTypeDao.save(detailShowingType);
        }
        return  moveSaved;
    }

    @Override
    @Transactional
    public Movie updateMovie(int id, MovieRequest request) {
        Optional<Movie> movie = movieDao.findById(id);
        if (movie.isPresent()) {
            movie.get().setTitle(request.getTitle());
            movie.get().setAdult(request.isAdult());
            movie.get().setBudget(request.getBudget());
            movie.get().setOriginalLanguage(request.getOriginalLanguage());
            movie.get().setOverview(request.getOverview());
            movie.get().setStatus(request.getStatus());
            movie.get().setVideo(request.getVideo());
            movie.get().setPosterPath(request.getPosterPath());
            movie.get().setBackdropPath(request.getBackdropPath());
            movie.get().setVoteAverage(request.getVoteAverage());
            movie.get().setVoteCount(request.getVoteCount());
            movie.get().setReleaseDate(request.getReleaseDate());

            List<Genre> genres = genreDao.findAllByIdIn(request.getGenreIds());
            Set<Genre> setGenres = new HashSet<>(genres);
            movie.get().setGenres(setGenres);

            return movieDao.save(movie.get());
        }
        return  null;
    }

    @Override
    @Transactional
    public Movie updateMovieScheduleDetail(int id, MovieRequest request) {
        Optional<Movie> movie = movieDao.findById(id);
        if (movie.isPresent()) {
            movie.get().setMonthToSchedule(request.getMonthToSchedule());
            movie.get().setYearToSchedule(request.getYearToSchedule());
            movie.get().setTotalShowings(request.getTotalShowings());
            List<DetailShowingType> detailShowingTypes = request.getDetailShowingTypes();
            movie.get().setDetailShowingTypes(detailShowingTypes);
            return movieDao.save(movie.get());
        }
        return  null;
    }

    private Movie convertMovieRequestToMovie(MovieRequest movieRequest) {
        Movie movie = new Movie();
        movie.setTitle(movieRequest.getTitle());
        movie.setAdult(movieRequest.isAdult());
        movie.setBudget(movieRequest.getBudget());
        movie.setOriginalLanguage(movieRequest.getOriginalLanguage());
        movie.setOverview(movieRequest.getOverview());
        movie.setStatus(movieRequest.getStatus());
        movie.setVideo(movieRequest.getVideo());
        movie.setPosterPath(movieRequest.getPosterPath());
        movie.setBackdropPath(movieRequest.getBackdropPath());
        movie.setVoteAverage(movieRequest.getVoteAverage());
        movie.setVoteCount(movieRequest.getVoteCount());
        movie.setReleaseDate(movieRequest.getReleaseDate());

        List<Genre> genres = genreDao.findAllByIdIn(movieRequest.getGenreIds());
        Set<Genre> setGenres = new HashSet<>(genres);
        movie.setGenres(setGenres);

        // set data for schedule
        movie.setMonthToSchedule(movieRequest.getMonthToSchedule());
        movie.setYearToSchedule(movieRequest.getYearToSchedule());
        movie.setTotalShowings(movieRequest.getTotalShowings());

        return movie;
    }
}
