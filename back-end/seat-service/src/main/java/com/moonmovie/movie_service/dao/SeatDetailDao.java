package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.SeatDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatDetailDao extends MongoRepository<SeatDetail, String> {
    List<SeatDetail> findAllByShowingId(int showingId);
}
