package com.moonmovie.movie_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShowingDto {
    private Integer id;

    private LocalDateTime startTime;
    private String type;
    private int auditoriumId;
    private int priceEachSeat;
    private int movieId;
}
