package com.moonmovie.movie_service.requests;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenerateSeatDetailRequest {
    private int showingId;
    private String auditoriumId;
    private int price;
}
