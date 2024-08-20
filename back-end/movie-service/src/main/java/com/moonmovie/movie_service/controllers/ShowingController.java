package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.services.ShowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v2/moon-movie/movie/showing")
public class ShowingController {

    @Autowired
    private ShowingService showingService;

    @GetMapping
    public ResponseEntity<List<ShowingDto>> getShowings(@RequestParam("startDate") LocalDateTime startDate, @RequestParam("movieId") int movieId) {
        return ResponseEntity.ok(showingService.getAllShowings(startDate, movieId));
    }

    @GetMapping("/{showingId}")
    public ResponseEntity<Showing> getShowing(@PathVariable("showingId") int showingId) {
        return ResponseEntity.ok(showingService.getShowing(showingId));
    }
}
