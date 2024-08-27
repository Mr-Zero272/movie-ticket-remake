package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.dto.UserFavoriteMovieDto;
import com.moonmovie.movie_service.models.UserFavoriteMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteMovieDao extends JpaRepository<UserFavoriteMovie, Integer> {

    @Query("SELECT ufm.id as id, ufm.movie.id as movieId, ufm.movie.title as title, ufm.movie.posterPath as posterPath, ufm.movie.releaseDate as releaseDate, ufm.movie.runtime as runtime, ufm.dateAdded as dateAdded FROM UserFavoriteMovie ufm WHERE ufm.userId = ?1")
    List<UserFavoriteMovieDto> findAllByUserId(String userId);

    @Query("SELECT ufm FROM UserFavoriteMovie ufm WHERE ufm.userId = ?1 AND ufm.movie.id = ?2")
    Optional<UserFavoriteMovie> findByUserIdAndMovieId(String userId, int movieId);
}
