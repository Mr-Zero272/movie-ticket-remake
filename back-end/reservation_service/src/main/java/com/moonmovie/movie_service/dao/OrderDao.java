package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDao extends MongoRepository<Order, String> {

}
