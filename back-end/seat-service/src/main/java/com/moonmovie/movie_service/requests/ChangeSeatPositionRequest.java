package com.moonmovie.movie_service.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeSeatPositionRequest {
    private LocalDateTime startTime;
    private String oldPosition;
    private String newPosition;
}
