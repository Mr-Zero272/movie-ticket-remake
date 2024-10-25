package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.models.ShowingStatistical;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface ShowingDao extends JpaRepository<Showing, Integer> {

    @Query("SELECT COUNT(s.id) FROM Showing s WHERE MONTH(s.startTime) = ?1 AND YEAR(s.startTime) = ?2")
    int countByMonthAndYear(int month, int year);

    @Query("SELECT s.id as id, s.startTime as startTime, s.type as type, s.auditoriumId as auditoriumId, s.priceEachSeat as priceEachSeat, s.movie.runtime as runtime, s.movie.title as title " +
            "FROM Showing s WHERE DAY(s.startTime) = ?2 AND s.startTime >= ?1 AND s.movie.id = ?3")
    List<ShowingDto> findAllByStartTimeGreaterThanEqualAndDateIsAndMovieIdIs(LocalDateTime startDate, int date, int movieId);

    @Query("SELECT DAY(s.startTime) as date, COUNT(*) as totalMovies FROM Showing s WHERE " +
            "MONTH(s.startTime) = ?1 AND YEAR(s.startTime) = ?2 GROUP BY DAY(s.startTime)")
    List<ShowingStatistical> getShowingStatistical(int month, int year);

    @Query("SELECT s.id as id, s.startTime as startTime, s.type as type, s.auditoriumId as auditoriumId, s.priceEachSeat as priceEachSeat, s.movie.runtime as runtime, s.movie.title as title " +
            "FROM Showing s WHERE DATE(s.startTime) = ?1 AND s.auditoriumId = ?2 ORDER BY s.startTime ASC")
    List<ShowingDto> findAllByStartTimeAndAuditoriumIdIsOrderAscConvertShowingDto(LocalDate date, String auditoriumId);

    @Query("SELECT count(s) FROM Showing s WHERE DATE(s.startTime) = ?1 AND s.auditoriumId = ?2 ORDER BY s.startTime ASC")
    Integer countByStartTimeAndAuditoriumIdIsOrderAsc(LocalDate date, String auditoriumId);

    @Query("SELECT DISTINCT s FROM Showing s WHERE DATE(s.startTime) = ?1 AND s.auditoriumId = ?2 ORDER BY s.startTime ASC")
    List<Showing> findAllByStartTimeAndAuditoriumIdIsOrderAsc(LocalDate date, String auditoriumId);

    @Query("SELECT s FROM Showing s WHERE DATE(s.startTime) = DATE(?1) AND s.startTime >= ?1 ORDER BY s.startTime, s.id")
    Page<Showing> findAllByDate(LocalDateTime date, Pageable pageable);

    @Query("SELECT s FROM Showing s JOIN s.movie m WHERE m.title LIKE ?1 AND DATE(s.startTime) = DATE(?2) AND s" +
            ".startTime >= ?2 ORDER BY s.startTime, s.id")
    Page<Showing> findAllByTitleLikeAndDate(String title, LocalDateTime date, Pageable pageable);

    @Query("SELECT s FROM Showing s WHERE s.auditoriumId = ?1 AND DATE(s.startTime) = DATE(?2) AND " +
            "s.startTime >= ?2 ORDER BY s.startTime, s.id")
    Page<Showing> findAllByAuditoriumIdAndDate(String auditoriumId, LocalDateTime date, Pageable pageable);

    @Query("SELECT s FROM Showing s JOIN s.movie m WHERE m.title LIKE ?1 AND s.auditoriumId = ?1  AND DATE(s" +
            ".startTime) = DATE(?2) AND s.startTime >= ?2 ORDER BY s.startTime, s.id")
    Page<Showing> findAllByTitleLikeAndAuditoriumIdAndDate(String title,  String auditoriumId, LocalDateTime date,
                                                           Pageable pageable);
}
