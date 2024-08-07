package com.moonmovie.movie_service.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditoriumState {
    private String auditoriumId;
    private LocalDateTime lastScreeningsStartTime;
    private int totalScreeningsScheduled;
}
