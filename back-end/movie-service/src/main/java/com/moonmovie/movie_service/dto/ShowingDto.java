package com.moonmovie.movie_service.dto;

import java.time.LocalDateTime;

public interface ShowingDto {
    public Integer getId();
    public LocalDateTime getStartTime();
    public String getType();
    public String getAuditoriumId();
    public int getPriceEachSeat();
    public String getTitle();
    public int getRuntime();
}
