package com.moonmovie.movie_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface ShowingDto {
    public Integer getId();
    public LocalDateTime getStartTime();
    public String getType();
    public String getAuditoriumId();
    public int getPriceEachSeat();
//    private int movieId;
}
