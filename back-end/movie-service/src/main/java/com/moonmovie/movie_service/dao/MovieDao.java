package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.dto.ScheduleMovie;
import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.models.MovieStatistical;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

public interface MovieDao extends JpaRepository<Movie, Integer> {

    Optional<Movie> findByTitle(String title);

    Page<Movie> findAllByIdIn(List<Integer> ids, Pageable pageable);

    Page<Movie> findAllByDeleteFlagIsFalse(Pageable pageable);

    Page<Movie> findAllByVoteCountGreaterThanEqual(int voteCount, Pageable pageable);

//    @Query(value = "SELECT DISTINCT m.* FROM Movie m JOIN MOVIE_GENRE mg ON m.id = mg.movie_id WHERE m.vote_count >= ?1 AND mg.genre_id = ?2", nativeQuery = true)
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE m.voteCount >= ?1 AND g.id = ?2")
    Page<Movie> findAllByVoteCountGreaterThanEqualAndGenreIs(int voteCount,  Integer genre, Pageable pageable);

    Page<Movie> findAllByStatus(String status, Pageable pageable);

    Page<Movie> findALlByDeleteFlagIsFalseAndTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query("SELECT SUM(m.totalShowings) FROM Movie m WHERE m.monthToSchedule = ?1 AND m.yearToSchedule = ?2")
    int sumTotalShowings(int month, int year);

    List<Movie> findAllByMonthToScheduleAndYearToSchedule(int month, int year);

    @Query("SELECT m FROM Movie m WHERE m.monthToSchedule = ?1 AND m.yearToSchedule = ?2")
    List<ScheduleMovie> findAllScheduleMovies(int month, int year);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.genres g WHERE LOWER(m.title) LIKE LOWER(?1) AND g.id = ?2 AND m.originalLanguage = ?3 AND m.status = ?4 ")
    Page<Movie> findAllPagination(Pageable pageable, String q, int genreId, String originalLanguage, String status);

    @Query("SELECT COUNT(*) as totalMovies, MONTH(m.createdAt) as month  FROM Movie m WHERE YEAR(m.createdAt) = ?1 GROUP BY MONTH(m.createdAt) ORDER BY MONTH(m.createdAt)")
    List<MovieStatistical> getMovieStatistical(int year);

    @Query("SELECT Count(*) as totalMovies, m.monthToSchedule as month  FROM Movie m WHERE m.yearToSchedule = ?1 GROUP BY m.monthToSchedule ORDER BY m.monthToSchedule")
    List<MovieStatistical> getMovieScheduleStatistical(int year);
}
