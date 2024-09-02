package com.moonmovie.reservation_service.dao;

import com.moonmovie.reservation_service.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDao extends MongoRepository<Order, String> {

}
