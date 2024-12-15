package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.dao.SeatDao;
import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.requests.UpdateSeatRequest;
import com.moonmovie.movie_service.services.SeatService;
import org.apache.kafka.common.protocol.types.Field;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/moon-movie/seat")
public class SeatController {
    @Autowired
    private SeatService seatService;

    @GetMapping("/aud/{auditoriumId}")
    public ResponseEntity<List<Seat>> getListSeatByAuditoriumName(@PathVariable("auditoriumId") ObjectId auditoriumId) {
        return ResponseEntity.ok(seatService.getSeatsByAuditoriumId(auditoriumId));
    }

    @PutMapping("/s/{seatId}")
    public ResponseEntity<Seat> updateSeat(@PathVariable("seatId") String seatId, @RequestBody UpdateSeatRequest request) {
        return ResponseEntity.ok(seatService.updateSeat(seatId, request));
    }
}
