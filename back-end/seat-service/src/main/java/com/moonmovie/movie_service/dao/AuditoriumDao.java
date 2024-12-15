package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Auditorium;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuditoriumDao extends MongoRepository<Auditorium, String> {

    int countByNameAndDeleteFlagIsFalse(String name);

    Optional<Auditorium> findByIdAndDeleteFlagIsFalse(String id);

    Page<Auditorium> findAllByNameContainsIgnoreCaseAndDeleteFlagIsFalse(String name,Pageable pageable);

    Page<Auditorium> findAllByDeleteFlagIsFalse(Pageable pageable);

    Optional<Auditorium> findByNameAndDeleteFlagIsFalse(String name);
}
