package com.moonmovie.movie_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketsSoldStatistical {
    private long totalTicketsSold;
    private String moviePoster;
    private String movieTitle;
    private int movieId;
}
