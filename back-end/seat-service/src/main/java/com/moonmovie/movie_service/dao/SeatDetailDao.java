package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.models.SeatDetail;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatDetailDao extends MongoRepository<SeatDetail, String> {
    List<SeatDetail> findAllByShowingId(int showingId);

    List<SeatDetail> findAllByShowingIdAndUserIdAndStatus(int showingId, String userId, String status);

    List<SeatDetail> findALlByShowingId(int showingId);

    @Aggregation({"{$match: {\"seat\": ?0}}"})
    List<SeatDetail> findAllBySeatId(ObjectId seatId);
}
