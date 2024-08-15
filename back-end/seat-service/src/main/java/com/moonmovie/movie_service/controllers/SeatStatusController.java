package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.response.ResponseMessage;
import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import com.moonmovie.movie_service.services.SeatDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/moon-movie/seat/seat-detail")
public class SeatStatusController {
    @Autowired
    private SeatDetailService seatDetailService;

    @GetMapping("/{showingId}")
    public ResponseEntity<List<SeatDetail>> fetchListSeatDetails(@PathVariable("showingId") int showingId) {
        return ResponseEntity.ok(seatDetailService.getListSeatDetail(showingId));
    }

    @PostMapping
    public ResponseEntity<List<String>> checkoutSeat(@RequestBody List<ChoosingSeatRequest> request) {
        return seatDetailService.checkoutSeat(request);
    }

    @PostMapping("/refresh-state")
    public ResponseEntity<ResponseMessage> refreshSeatState(@RequestBody List<String> listSeatIds) {
        return seatDetailService.refreshSeatState(listSeatIds);
    }
}
