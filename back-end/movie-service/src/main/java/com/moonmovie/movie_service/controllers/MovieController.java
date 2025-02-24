package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.dto.MovieDto;
import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.models.MovieStatistical;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.requests.ScheduleRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.responses.ScheduleResponse;
import com.moonmovie.movie_service.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v2/moon-movie/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<PaginationResponse<Movie>> getAllMovies(
            @RequestParam(value = "q", defaultValue = "", required = false) String query,
            @RequestParam(value = "genreId", required = false, defaultValue = "") Integer genreId,
            @RequestParam(value = "sort", defaultValue = "none", required = false) String sort,
            @RequestParam(value = "sortOrder", defaultValue = "asc", required = false) String sortOrder,
            @RequestParam(value = "originalLanguage", defaultValue = "", required = false) String originalLanguage,
            @RequestParam(value = "status", defaultValue = "", required = false) String status,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(movieService.getAllMovies(query, genreId, originalLanguage, status, sort, sortOrder, page, size));
    }

    @GetMapping("/popular")
    public ResponseEntity<PaginationResponse<Movie>> getPopularMovies(
            @RequestParam(value = "genreId", required = false, defaultValue = "") Integer genreId,
            @RequestParam(value = "sort", defaultValue = "releaseDate") String sort,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(movieService.getPopularMovies(page, size, sort, genreId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<PaginationResponse<Movie>> getUpcomingMovies(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(movieService.getUpcomingMovies(page, size));
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<Movie> getMovieById(@PathVariable("movieId") int movieId) {
        return ResponseEntity.ok(movieService.getMovieById(movieId));
    }

    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody MovieRequest request) {
        return ResponseEntity.ok(movieService.addMovie(request));
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable("movieId") int id, @RequestBody MovieRequest request) {
        return ResponseEntity.ok(movieService.updateMovie(id, request));
    }

    @PutMapping("/schedule/{movieId}")
    public ResponseEntity<Movie> updateScheduleInfo(@PathVariable("movieId") int id, @RequestBody MovieRequest request) {
        return ResponseEntity.ok(movieService.updateMovieScheduleDetail(id, request));
    }

    @PostMapping("/schedule")
    public ResponseEntity<ScheduleResponse> scheduleMovie(
            @RequestHeader("role") String role,
            @RequestBody ScheduleRequest request) {
        // TODO check role in the request
        return ResponseEntity.ok(movieService.schedule(request.getMonth(), request.getYear(), role));
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<MovieDto> deleteMovie(@PathVariable("movieId") int id) {
        return ResponseEntity.ok(movieService.deleteMovie(id));
    }

    @GetMapping("/movie-showing/{showingId}")
    public ResponseEntity<MovieDto> getMovieInfoFromShowing(@PathVariable("showingId") Integer showingId) {
        return ResponseEntity.ok(movieService.getMovieByShowingId(showingId));
    }

    @GetMapping("/recommend")
    public ResponseEntity<List<Movie>> getMovieRecommendation(@RequestParam("movieId") Integer movieId) {
        return ResponseEntity.ok(movieService.getRecommendMoviesByMovieId(movieId));
    }

    @PutMapping("/edit-data")
    public ResponseEntity<ResponseTemplate> editDate() {
        movieService.updateDataMovie();
        return ResponseEntity.ok(new ResponseTemplate(200, "Edit movies data success!"));
    }

    @GetMapping("/statistical")
    public ResponseEntity<List<MovieStatistical>> getMovieStatistical(@RequestParam(value = "year", defaultValue = "2024") Integer year) {
        return ResponseEntity.ok(movieService.getMovieStatistical(year));
    }

    @GetMapping("/schedule/statistical")
    public ResponseEntity<List<MovieStatistical>> getScheduleMovieStatistical(@RequestParam(value = "year", defaultValue = "2024") Integer year) {
        return ResponseEntity.ok(movieService.getScheduleMovieStatistical(year));
    }
}
