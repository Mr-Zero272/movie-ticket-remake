package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.UserFavoriteMovieDto;
import com.moonmovie.movie_service.models.UserFavoriteMovie;
import com.moonmovie.movie_service.responses.ResponseTemplate;

import java.util.List;

public interface UserFavoriteMovieService {
    List<UserFavoriteMovieDto> getUserFavoriteMovieByUserId(String userId);
    UserFavoriteMovie addUserFavoriteMovie(String userId, int movieId);
    ResponseTemplate deleteUserFavoriteMovie(int movieId, String userId);
}
