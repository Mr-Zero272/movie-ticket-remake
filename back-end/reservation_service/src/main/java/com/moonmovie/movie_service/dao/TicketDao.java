package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Ticket;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketDao extends MongoRepository<Ticket, String> {
    @Aggregation(pipeline = {
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { $or: [{ 'order.customerId': ?0, 'order.orderStatus': 'complete' }, { 'order.customerId': ?0, 'order.orderStatus': 'pending' } ] } }"
    })
    List<Ticket> findAllTicketsFilterAll(String userId, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { $or: [{ 'order.customerId': ?0, 'order.orderStatus': 'complete' }, { 'order.customerId': ?0, 'order.orderStatus': 'pending' } ] } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countTicketsFilterAll(String userId);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?1 }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'complete' } }"
    })
    List<Ticket> findAllTicketsFilterActiveOrExpired(String userId, LocalDateTime currentDate, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?1 }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'complete' } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countTicketsFilterActiveOrExpired(String userId, LocalDateTime currentDate);

    @Aggregation(pipeline = {
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'pending' } }"
    })
    List<Ticket> findAllTicketsFilterUnpaid(String userId, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'pending' } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countTicketsFilterUnpaid(String userId);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?2 }}}",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus':  ?1 } }"
    })
    List<Ticket> findPaidTicketsByUserId(String userId, String orderStatus, LocalDateTime date, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?2 }}}",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': ?1 } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countPaidTicketsByUserId(String userId, String orderStatus, LocalDateTime date);

    List<Ticket> findAllByOrderId(ObjectId orderId);
}
