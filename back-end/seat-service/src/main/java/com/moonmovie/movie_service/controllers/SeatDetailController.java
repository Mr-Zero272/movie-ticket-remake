package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.dto.SeatDetailDto;
import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.requests.ChangeSeatPositionRequest;
import com.moonmovie.movie_service.requests.RefreshSeatStateRequest;
import com.moonmovie.movie_service.response.ResponseTemplate;
import com.moonmovie.movie_service.services.SeatDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/moon-movie/seat/seat-detail")
public class SeatDetailController {
    @Autowired
    private SeatDetailService seatDetailService;

    @GetMapping
    public ResponseEntity<List<SeatDetail>> fetchListSeatDetails(@RequestParam("showingId") int showingId) {
        return ResponseEntity.ok(seatDetailService.getListSeatDetail(showingId));
    }

    @PostMapping("/position")
    public ResponseEntity<SeatDetail> changeSeatPosition(@RequestBody ChangeSeatPositionRequest request) {
        return ResponseEntity.ok(seatDetailService.changeSeatPosition(request));
    }

    @PostMapping("/refresh-state")
    public ResponseEntity<ResponseTemplate> refreshSeatState(@RequestBody RefreshSeatStateRequest request) {
        return ResponseEntity.ok(seatDetailService.refreshSeatState(request.getShowingId(), request.getUserId()));
    }

    @GetMapping("/list")
    public ResponseEntity<List<SeatDetailDto>> fetchInfoSeatDetail(@RequestParam("showingId") int showingId, @RequestParam("userId") String userId) {
        return ResponseEntity.ok(seatDetailService.getListSeatDetailDto(showingId, userId));
    }

    @GetMapping("/checkout")
    public ResponseEntity<ResponseTemplate> checkListSeatAvailableToCheckout(@RequestParam("seatIds") List<String> seatIds, @RequestParam("userId") String userId) {
        return ResponseEntity.ok(seatDetailService.checkIfListSeatAvailableToCheckout(seatIds, userId));
    }
}
