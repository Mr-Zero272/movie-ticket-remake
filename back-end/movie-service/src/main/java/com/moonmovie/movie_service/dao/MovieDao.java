package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.dto.ScheduleMovie;
import com.moonmovie.movie_service.models.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MovieDao extends JpaRepository<Movie, Integer> {

    Optional<Movie> findByTitle(String title);

    Page<Movie> findAllByDeleteFlagIsFalse(Pageable pageable);

    Page<Movie> findAllByVoteCountGreaterThanEqual(int voteCount, Pageable pageable);

    Page<Movie> findALlByDeleteFlagIsFalseAndTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query("SELECT SUM(m.totalShowings) FROM Movie m WHERE m.monthToSchedule = ?1 AND m.yearToSchedule = ?2")
    int sumTotalShowings(int month, int year);

    List<Movie> findAllByMonthToScheduleAndYearToSchedule(int month, int year);

    @Query("SELECT m FROM Movie m WHERE m.monthToSchedule = ?1 AND m.yearToSchedule = ?2")
    List<ScheduleMovie> findAllScheduleMovies(int month, int year);
}
