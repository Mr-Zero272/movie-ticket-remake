package com.moonmovie.movie_service.feign;

import com.moonmovie.movie_service.dto.SeatDetailDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("SEAT-SERVICE")
public interface SeatServiceInterface {
    @GetMapping("/api/v2/moon-movie/seat/seat-detail/list")
    public ResponseEntity<List<SeatDetailDto>> fetchInfoSeatDetail(@RequestParam("showingId") int showingId, @RequestParam("userId") String userId);
}
