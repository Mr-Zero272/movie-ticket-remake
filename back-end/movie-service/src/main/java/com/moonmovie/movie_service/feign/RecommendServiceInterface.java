package com.moonmovie.movie_service.feign;

import com.moonmovie.movie_service.responses.RecommendMovieResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("RECOMMEND-SERVICE")
public interface RecommendServiceInterface {
    @GetMapping("/api/v2/moon-movie/recommend/{movieId}")
    public ResponseEntity<RecommendMovieResponse> fetchRecommendMovieById(@PathVariable("movieId") Integer movieId);
}
