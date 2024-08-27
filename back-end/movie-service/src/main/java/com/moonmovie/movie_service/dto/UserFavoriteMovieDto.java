package com.moonmovie.movie_service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface UserFavoriteMovieDto {
    public Integer getId();
    public Integer getMovieId();
    public String getTitle();
    public String getPosterPath();
    public LocalDate getReleaseDate();
    public int getRuntime();
    public LocalDateTime getDateAdded();
}
