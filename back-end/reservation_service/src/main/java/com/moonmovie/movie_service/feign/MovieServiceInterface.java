package com.moonmovie.movie_service.feign;

import com.moonmovie.movie_service.dto.MovieDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("MOVIE-SERVICE")
public interface MovieServiceInterface {
    @GetMapping("/api/v2/moon-movie/movie/movie-showing/{showingId}")
    public ResponseEntity<MovieDto> getMovieInforFromShowing(@PathVariable("showingId") Integer showingId);
}
