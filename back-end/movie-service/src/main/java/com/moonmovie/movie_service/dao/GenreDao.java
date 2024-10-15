package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Genre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreDao extends JpaRepository<Genre, Integer> {
    List<Genre> findAllByIdIn(List<Integer> ids);
    Page<Genre> findAllByNameContainingIgnoreCase(String name, Pageable pageable);
    Integer countByName(String name);
}
