package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.dao.SeatDao;
import com.moonmovie.movie_service.models.Seat;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v2/moon-movie/seat")
public class SeatController {
    @Autowired
    private SeatDao seatDao;

    @GetMapping("/{auditoriumId}")
    public List<Seat> getListSeatByAuditoriumName(@PathVariable("auditoriumId") ObjectId auditoriumId) {
        return seatDao.findByAuditoriumId(auditoriumId);
    }
}
