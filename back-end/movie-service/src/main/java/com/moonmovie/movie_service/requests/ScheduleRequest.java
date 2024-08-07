package com.moonmovie.movie_service.requests;

import lombok.Data;

@Data
public class ScheduleRequest {
    private int month;
    private int year;
}
