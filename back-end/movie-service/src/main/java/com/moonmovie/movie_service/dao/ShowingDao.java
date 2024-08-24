package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.models.Showing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowingDao extends JpaRepository<Showing, Integer> {

    @Query("SELECT COUNT(s.id) FROM Showing s WHERE MONTH(s.startTime) = ?1 AND YEAR(s.startTime) = ?2")
    int countByMonthAndYear(int month, int year);

    @Query("SELECT s FROM Showing s WHERE DAY(s.startTime) = ?2 AND s.startTime >= ?1 AND s.movie.id = ?3")
    List<ShowingDto> findAllByStartTimeGreaterThanEqualAndDateIsAndMovieIdIs(LocalDateTime startDate, int date, int movieId);

    Page<Showing> findAllByStartTimeGreaterThanEqual(LocalDateTime startDate, Pageable pageable);

}
