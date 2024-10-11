package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.models.Auditorium;
import com.moonmovie.movie_service.response.PaginationResponse;
import com.moonmovie.movie_service.services.AuditoriumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/moon-movie/seat/auditorium")
public class AuditoriumController {

    @Autowired
    private AuditoriumService auditoriumService;

    @PostMapping
    public ResponseEntity<Auditorium> addNewAuditorium(@RequestBody Auditorium request) {
        return ResponseEntity.ok(auditoriumService.addAuditorium(request));
    }

    @PutMapping("/{auditoriumId}")
    public ResponseEntity<Auditorium> editAuditorium(@PathVariable("auditoriumId") String auditoriumId, @RequestBody Auditorium auditorium) {
        return ResponseEntity.ok(auditoriumService.updateAuditorium(auditoriumId, auditorium));
    }

    @GetMapping("/{auditoriumId}")
    public ResponseEntity<Auditorium> getAuditoriumById(@PathVariable("auditoriumId") String id) {
        return ResponseEntity.ok(auditoriumService.getAuditoriumById(id));
    }

    @GetMapping("/available-auditorium")
    public ResponseEntity<List<String>> getAvailableAuditorium(@RequestParam(name = "numAuditoriums", defaultValue = "10") Integer numAuditoriums) {
        return ResponseEntity.ok(auditoriumService.getAvailableAuditoriums(numAuditoriums));
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<Auditorium>> searchAuditorium(
            @RequestParam(value = "query", required = false, defaultValue = "") String q,
            @RequestParam(value = "sort", required = false, defaultValue = "none") String sort,
            @RequestParam(value = "sortOrder", required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(value = "size", required = false, defaultValue = "20") int size,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        return ResponseEntity.ok(auditoriumService.getPaginationAuditorium(q, sort, sortOrder, size, page));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Auditorium>> getAllAuditoriums() {
        return auditoriumService.fetchAllAuditoriums();
    }
}
