package com.moonmovie.movie_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("RESERVATION-SERVICE")
public interface ReservationServiceInterface {
    @GetMapping("api/v2/moon-movie/reservation/ticket/showing/total/{showingId} ")
    public ResponseEntity<Integer> getTotalTicketsByShowingId(@PathVariable("showingId") int showingId);
}
