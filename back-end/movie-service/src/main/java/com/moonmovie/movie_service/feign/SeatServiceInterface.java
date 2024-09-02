package com.moonmovie.movie_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("SEAT-SERVICE")
public interface SeatServiceInterface {
    @GetMapping("/api/v2/moon-movie/seat/auditorium/available-auditorium")
    public ResponseEntity<List<String>> getAvailableAuditorium(@RequestParam(name = "numAuditoriums", defaultValue = "10") Integer numAuditoriums);
}
