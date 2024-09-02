package com.moonmovie.reservation_service.feign;

import com.moonmovie.reservation_service.dto.MovieDto;
import com.moonmovie.reservation_service.dto.SeatDetailDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("MOVIE-SERVICE")
public interface MovieServiceInterface {
    @GetMapping("/api/v2/moon-movie/movie/movie-showing/{showingId}")
    public ResponseEntity<MovieDto> getMovieInforFromShowing(@PathVariable("showingId") Integer showingId);
}
