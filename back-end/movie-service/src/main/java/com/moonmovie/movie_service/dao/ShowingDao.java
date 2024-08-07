package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Showing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowingDao extends JpaRepository<Showing, Integer> {

    @Query("SELECT COUNT(s.id) FROM Showing s WHERE MONTH(s.startTime) = ?1 AND YEAR(s.startTime) = ?2")
    int countByMonthAndYear(int month, int year);
}
