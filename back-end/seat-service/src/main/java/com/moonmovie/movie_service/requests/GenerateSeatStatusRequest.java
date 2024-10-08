package com.moonmovie.movie_service.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateSeatStatusRequest {
    private String screeningId;
    private String auditoriumId;
    private int price;
}
