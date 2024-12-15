package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.models.ShowingStatistical;
import com.moonmovie.movie_service.requests.AddShowingRequest;
import com.moonmovie.movie_service.requests.UpdateShowingTimeAndAuditoriumRequest;
import com.moonmovie.movie_service.responses.FutureShowingsResponse;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface ShowingService {
    public Showing addShowing(Showing showing);

    public List<ShowingDto> getAllShowings(LocalDateTime startDate, int movieId);

    Showing getShowing(int showingId);

    PaginationResponse<Showing> getPaginationShowings(String query, LocalDateTime date, String auditoriumId, int page, int size);

    List<ShowingDto> getShowingsByDateAndAuditorium(LocalDate date, String auditoriumId);

    Showing updateShowingTimeAndAuditorium(int showingId, UpdateShowingTimeAndAuditoriumRequest request);

    Showing addShowing(AddShowingRequest request);

    ResponseTemplate deleteShowing(int showingId);

    List<ShowingStatistical> getShowingStatistical(Integer month, Integer year);

    FutureShowingsResponse getEarliestShowtimesForMovie(Integer movieId);
}
