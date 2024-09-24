package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import com.moonmovie.movie_service.dao.MovieDao;
import com.moonmovie.movie_service.dao.UserFavoriteMovieDao;
import com.moonmovie.movie_service.dto.UserFavoriteMovieDto;
import com.moonmovie.movie_service.exceptions.GlobalException;
import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.models.UserFavoriteMovie;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.services.UserFavoriteMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserFavoriteMovieServiceImpl implements UserFavoriteMovieService {

    @Autowired
    private UserFavoriteMovieDao userFavoriteMovieDao;

    @Autowired
    private MovieDao movieDao;

    @Override
    public List<UserFavoriteMovieDto> getUserFavoriteMovieByUserId(String userId) {
        return userFavoriteMovieDao.findAllByUserId(userId);
    }

    @Override
    public UserFavoriteMovie addUserFavoriteMovie(String userId, int movieId) {
        if (userFavoriteMovieDao.findByUserIdAndMovieId(userId, movieId).isPresent()) {
            return null;
        }

        Movie movie = movieDao.findById(movieId).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_MOVIE_NOT_EXISTS));
        UserFavoriteMovie userFavoriteMovie = new UserFavoriteMovie();
        userFavoriteMovie.setUserId(userId);
        userFavoriteMovie.setMovie(movie);
        userFavoriteMovie.setDateAdded(LocalDateTime.now());
        return userFavoriteMovieDao.save(userFavoriteMovie);
    }

    @Override
    public ResponseTemplate deleteUserFavoriteMovie(int movieId, String userId) {
        UserFavoriteMovie userFavoriteMovie = userFavoriteMovieDao.findByUserIdAndMovieId(userId, movieId).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_MOVIE_NOT_EXISTS));
        userFavoriteMovieDao.delete(userFavoriteMovie);
        return new ResponseTemplate("Delete favorite movie with id: " + userFavoriteMovie.getId() + " successfully!");
    }
}
