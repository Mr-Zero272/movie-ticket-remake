package com.moonmovie.movie_service.responses;

import lombok.Data;

import java.util.List;

@Data
public class RecommendMovieResponse {
    private int movieId;
    private List<List<Double>> suggestions;
}
