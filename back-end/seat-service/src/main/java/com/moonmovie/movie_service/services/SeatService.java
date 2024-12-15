package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.requests.UpdateSeatRequest;
import org.bson.types.ObjectId;

import java.util.List;

public interface SeatService {
    List<Seat> getSeatsByAuditoriumId(ObjectId auditoriumId);
    Seat updateSeat(String seatId, UpdateSeatRequest request);
}
