package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Gallery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface GalleryDao extends CrudRepository<Gallery, Integer> {

    @Query("DELETE FROM Gallery g WHERE g.movie.id = ?1")
    public void deleteAllByMovieId(int movieId);
}
