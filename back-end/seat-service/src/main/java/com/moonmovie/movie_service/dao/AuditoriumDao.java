package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Auditorium;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuditoriumDao extends MongoRepository<Auditorium, String> {

    int countByName(String name);

    Page<Auditorium> findAllByNameContainsIgnoreCase(String name,Pageable pageable);

    Optional<Auditorium> findByName(String name);
}
