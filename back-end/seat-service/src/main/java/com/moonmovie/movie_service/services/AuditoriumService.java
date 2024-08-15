package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Auditorium;
import com.moonmovie.movie_service.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AuditoriumService {
    public Auditorium addAuditorium(Auditorium auditorium);

    public Auditorium updateAuditorium(String auditoriumId, Auditorium auditorium);

    public List<String> getAvailableAuditoriums(int numAuditoriums);

    public ResponseEntity<List<Auditorium>> fetchAllAuditoriums();

    public Auditorium getAuditoriumById(String id);

    public PaginationResponse<Auditorium> getPaginationAuditorium(String q, int size, int page);
}
