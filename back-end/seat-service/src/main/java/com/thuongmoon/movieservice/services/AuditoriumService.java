package com.thuongmoon.movieservice.services;

import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.response.PaginationResponse;
import com.thuongmoon.movieservice.response.ResponsePagination;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditoriumService {
    public Auditorium addAuditorium(Auditorium auditorium);

    public Auditorium updateAuditorium(String auditoriumId, Auditorium auditorium);

    public ResponseEntity<List<String>> provideAuditoriumNeed(Integer numAuditoriums, LocalDateTime startDate);

    public ResponseEntity<List<Auditorium>> fetchAllAuditoriums();

    public Auditorium getAuditoriumById(String id);

    public PaginationResponse<Auditorium> getPaginationAuditorium(String q, int size, int page);
}
