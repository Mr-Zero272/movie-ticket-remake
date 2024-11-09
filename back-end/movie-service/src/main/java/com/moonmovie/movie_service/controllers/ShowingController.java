package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.models.MovieStatistical;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.models.ShowingStatistical;
import com.moonmovie.movie_service.requests.AddShowingRequest;
import com.moonmovie.movie_service.requests.UpdateShowingTimeAndAuditoriumRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.services.ShowingService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/v2/moon-movie/movie/showing")
public class ShowingController {

    @Autowired
    private ShowingService showingService;

    @GetMapping
    public ResponseEntity<List<ShowingDto>> getShowings(
            @RequestParam("startDate") LocalDateTime startDate,
            @RequestParam("movieId") int movieId) {
        return ResponseEntity.ok(showingService.getAllShowings(startDate, movieId));
    }

    @GetMapping("/schedule")
    public ResponseEntity<PaginationResponse<Showing>> getScheduledShowings(
            @RequestParam(value = "query", defaultValue = "") String query,
            @RequestParam(value = "auditoriumId", defaultValue = "") String auditoriumId,
            @RequestParam(value = "date", defaultValue = "2024-11-01T00:00:00") LocalDateTime date,
            @RequestParam(value = "page", defaultValue = "1", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size) {
        return ResponseEntity.ok(showingService.getPaginationShowings(query, date, auditoriumId, page, size));
    }

    @GetMapping("/{showingId}")
    public ResponseEntity<Showing> getShowing(@PathVariable("showingId") int showingId) {
        return ResponseEntity.ok(showingService.getShowing(showingId));
    }

    @DeleteMapping("/{showingId}")
    public ResponseEntity<ResponseTemplate> deleteShowing(@PathVariable("showingId") int showingId) {
        ResponseTemplate res = showingService.deleteShowing(showingId);
      return new ResponseEntity<>(res, HttpStatusCode.valueOf(res.getHttpStatusCode()));
    }

    @GetMapping("/auditorium")
    public ResponseEntity<List<ShowingDto>> getShowingForAuditorium(
            @RequestParam("auditoriumId") String auditoriumId,
            @RequestParam("date") LocalDate date) {
        return ResponseEntity.ok(showingService.getShowingsByDateAndAuditorium(date, auditoriumId));
    }

    @PutMapping("/auditorium/{showingId}")
    public ResponseEntity<Showing> updateShowingTimeAndAuditorium(
//            @RequestHeader("role") String role,
            @PathVariable("showingId") Integer showingId,
            @RequestBody UpdateShowingTimeAndAuditoriumRequest request) {
        return ResponseEntity.ok(showingService.updateShowingTimeAndAuditorium(showingId, request));
    }

    @PostMapping
    public ResponseEntity<Showing> addNewShowing(@RequestBody AddShowingRequest request) {
        return ResponseEntity.ok(showingService.addShowing(request));
    }

    @GetMapping("/statistical")
    public ResponseEntity<List<ShowingStatistical>> getMovieStatistical(
            @RequestParam(value = "year", defaultValue = "2024") Integer year,
            @RequestParam(value = "month", defaultValue = "8") Integer month) {
        return ResponseEntity.ok(showingService.getShowingStatistical(month, year));
    }
}
