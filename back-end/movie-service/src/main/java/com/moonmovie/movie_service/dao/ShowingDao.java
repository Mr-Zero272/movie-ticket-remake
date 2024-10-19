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

    @Query("SELECT s FROM Showing s WHERE DATE(s.startTime) = ?1 AND s.auditoriumId = ?2 ORDER BY s.startTime ASC")
    List<Showing> findAllByStartTimeAndAuditoriumIdIsOrderAsc(LocalDate date, String auditoriumId);

    @Query("SELECT s FROM Showing s JOIN s.movie m WHERE m.title LIKE ?1 AND DATE(s.startTime) = DATE(?2) AND s.startTime >= ?2 AND s.auditoriumId LIKE ?3 ORDER BY s.startTime ASC")
    Page<Showing> findAllByTitleLikeAndDateEqual(String title, LocalDateTime date, String auditoriumId, Pageable pageable);

    @Query("SELECT s FROM Showing s JOIN s.movie m JOIN m.genres g WHERE m.title LIKE ?1 AND DATE(s.startTime) = DATE(?2) AND s.startTime >= ?2 AND g.id = ?3 AND s.auditoriumId LIKE ?4 ORDER BY s.startTime ASC")
    Page<Showing> findAllByTitleLikeAndDateEqualAndGenreEqual(String title, LocalDateTime date, Integer genreId, String auditoriumId, Pageable pageable);

    @Query("SELECT s FROM Showing s JOIN s.movie m WHERE m.title LIKE ?1 AND DATE(s.startTime) = DATE(?2) AND s.startTime >= ?2 AND lower(s.type) =  lower(?3) AND s.auditoriumId LIKE ?4 ORDER BY s.startTime ASC")
    Page<Showing> findAllByTitleLikeAndDateEqualAndTypeEqualIgnoreCase(String title, LocalDateTime date, String type, String auditoriumId, Pageable pageable);

    @Query("SELECT s FROM Showing s JOIN s.movie m JOIN m.genres g WHERE m.title LIKE ?1 AND DATE(s.startTime) = DATE(?2) AND s.startTime >= ?2 AND g.id = ?3 AND lower(s.type) =  lower(?4) AND s.auditoriumId LIKE ?5 ORDER BY s.startTime ASC")
    Page<Showing> findAllByTitleLikeAndDateEqualAndGenreEqualAndTypeEqualIgnoreCase(String title, LocalDateTime date, Integer genreId, String type, String auditoriumId, Pageable pageable);
}
