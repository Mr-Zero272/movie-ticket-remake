package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.responses.PaginationResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ShowingService {
    public Showing addShowing(Showing showing);

    public List<ShowingDto> getAllShowings(LocalDateTime startDate, int movieId);

    Showing getShowing(int showingId);

    PaginationResponse<Showing> getPaginationShowings(LocalDateTime startDate, int page, int size);
}
