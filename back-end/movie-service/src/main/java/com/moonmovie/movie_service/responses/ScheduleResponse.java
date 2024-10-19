package com.moonmovie.movie_service.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleResponse {
    private int totalShowingsScheduled;
    private int monthSchedule;
    private int totalDatesScheduled;
    private int totalAuditoriums;
    private int maxScreeningPerDate;
}
