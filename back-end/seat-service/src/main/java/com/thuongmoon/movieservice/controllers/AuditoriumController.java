package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.response.PaginationResponse;
import com.thuongmoon.movieservice.services.AuditoriumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @GetMapping("/av-auditorium")
    public ResponseEntity<List<String>> getAvailableAuditorium(@Param("numAuditoriums") Integer numAuditoriums,
                                                               @Param("startDate") LocalDateTime startDate) {
        return auditoriumService.provideAuditoriumNeed(numAuditoriums, startDate);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<Auditorium>> searchAuditorium(@RequestParam(required = false, defaultValue = "") String q,
                                                               @RequestParam(required = false, defaultValue = "20") int size,
                                                               @RequestParam(required = false, defaultValue = "1") int page) {
        return ResponseEntity.ok(auditoriumService.getPaginationAuditorium(q, size, page));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Auditorium>> getAllAuditoriums() {
        return auditoriumService.fetchAllAuditoriums();
    }
}
