package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Showing;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ShowingService {
    public Showing addShowing(Showing showing);

    public List<Showing> getAllShowings(LocalDateTime startDate, int movieId);
}
