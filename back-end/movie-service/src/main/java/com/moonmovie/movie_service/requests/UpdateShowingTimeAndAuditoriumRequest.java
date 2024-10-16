package com.moonmovie.movie_service.requests;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateShowingTimeAndAuditoriumRequest {
    private String oldAuditoriumId;
    private LocalDate oldDate;
    private int oldPosition;
    private String newAuditoriumId;
    private LocalDate newDate;
    private int newPosition;
}
