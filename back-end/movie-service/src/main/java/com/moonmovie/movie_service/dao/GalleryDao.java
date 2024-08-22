package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Gallery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GalleryDao extends CrudRepository<Gallery, Integer> {

    @Query("DELETE FROM Gallery g WHERE g.movie.id = ?1")
    public void deleteAllByMovieId(int movieId);

    @Query("SELECT g FROM Gallery  g WHERE g.movie.id = ?1")
    List<Gallery> findAllByMovieId(int movieId);

    void deleteById(int id);
}
