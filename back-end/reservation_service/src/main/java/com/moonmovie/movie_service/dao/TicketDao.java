package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Ticket;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketDao extends MongoRepository<Ticket, String> {
    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?2 }}}",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus':  ?1 } }"
    })
    List<Ticket> findPaidTicketsByUserId(String userId, String orderStatus, LocalDateTime currentDate, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?2 }}}",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': ?1 } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countPaidTicketsByUserId(String userId, String orderStatus, LocalDateTime currentDate);

    List<Ticket> findAllByOrderId(String orderId);
}
