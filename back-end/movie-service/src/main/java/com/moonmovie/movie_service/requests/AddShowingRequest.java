package com.moonmovie.movie_service.requests;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AddShowingRequest {
    private LocalDate date;
    private int position;
    private String type;
    private String auditoriumId;
    private int movieId;
}
