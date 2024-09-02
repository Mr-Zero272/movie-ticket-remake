package com.moonmovie.reservation_service.dao;

import com.moonmovie.reservation_service.models.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentDao extends MongoRepository<Payment, String> {
}
