package com.moonmovie.reservation_service.dao;

import com.moonmovie.reservation_service.models.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketDao extends MongoRepository<Ticket, String> {
    @Aggregation(pipeline = {
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'paid' } }"
    })
    Slice<Ticket> findPaidTicketsByUserId(String userId, Pageable pageable);
}
