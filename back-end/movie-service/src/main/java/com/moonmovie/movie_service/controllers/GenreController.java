package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.models.Genre;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/moon-movie/movie/genre")
public class GenreController {
    @Autowired
    private GenreService genreService;

    @GetMapping
    public ResponseEntity<PaginationResponse<Genre>> getAllGenres(
            @RequestParam(value = "q", defaultValue = "", required = false) String query,
            @RequestParam(value = "sort", defaultValue = "none", required = false) String sort,
            @RequestParam(value = "sortOrder", defaultValue = "asc", required = false) String sortOrder,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(genreService.getAllGenres(query, sort, sortOrder, page, size));
    }

    @PostMapping
    public ResponseEntity<Genre> createGenre(@RequestBody Genre genre) {
        return ResponseEntity.ok(genreService.addGenre(genre));
    }

    @PutMapping("/{genreId}")
    public ResponseEntity<Genre> updateGenre(@PathVariable int genreId, @RequestBody Genre genre) {
        return ResponseEntity.ok(genreService.updateGenre(genre, genreId));
    }
}
