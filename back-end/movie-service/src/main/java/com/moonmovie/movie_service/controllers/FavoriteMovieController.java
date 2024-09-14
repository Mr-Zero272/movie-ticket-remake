package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.dto.UserFavoriteMovieDto;
import com.moonmovie.movie_service.models.UserFavoriteMovie;
import com.moonmovie.movie_service.requests.FavoriteMovieRequest;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.services.UserFavoriteMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v2/moon-movie/movie/favorite")
public class FavoriteMovieController {

    @Autowired
    private UserFavoriteMovieService userFavoriteMovieService;

    @GetMapping
    public ResponseEntity<List<UserFavoriteMovieDto>> getFavoriteMovies(@RequestHeader("user-id") String userId) {
        return ResponseEntity.ok(userFavoriteMovieService.getUserFavoriteMovieByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<UserFavoriteMovie> createFavoriteMovie(@RequestBody FavoriteMovieRequest favoriteMovieRequest) {
        return ResponseEntity.ok(userFavoriteMovieService.addUserFavoriteMovie(favoriteMovieRequest.getUserId(), favoriteMovieRequest.getMovieId()));
    }

    @DeleteMapping("/{movieId}/{userId}")
    public ResponseEntity<ResponseTemplate> deleteFavoriteMovie(@PathVariable("movieId") Integer movieId, @PathVariable("userId") String userId) {
        return ResponseEntity.ok(userFavoriteMovieService.deleteUserFavoriteMovie(movieId, userId));
    }
}
