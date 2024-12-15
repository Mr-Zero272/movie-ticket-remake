package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.models.TicketsSoldStatistical;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketDao extends MongoRepository<Ticket, String> {

    List<Ticket> findAllBySeatId(String seatId);

    @Aggregation(pipeline = {
            "{ '$match': {\"status\": \"paid\"}}",
            "{'$group': {'_id': \"$movieId\", \"totalTicketsSold\": { \"$sum\": 1 },\"moviePoster\": { $first: " +
                    "\"$moviePoster\"} , \"movieTitle\": { $first: \"$movieTitle\"}}}",
            "{'$sort': {?0: ?1}}",
            "{ $project: { _id: 0, movieId: \"$_id\", totalTicketsSold: 1, moviePoster: 1, movieTitle: 1}}"
    })
    List<TicketsSoldStatistical> findAllSoldStatistical(String sort, int sortOrder, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': {\"status\": \"paid\"}}",
            "{'$group': {'_id': \"$movieId\", \"totalTicketsSold\": { \"$sum\": 1 },\"moviePoster\": { $first: " +
                    "\"$moviePoster\"} , \"movieTitle\": { $first: \"$movieTitle\"}}}",
            "{ $project: { _id: 0, movieId: \"$_id\", totalTicketsSold: 1, moviePoster: 1, movieTitile: 1}}",
            "{ '$count': \"total\"}"
    })
    Integer countSoldStatistical();


    @Aggregation(pipeline = {
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { $or: [{ 'order.customerId': ?0, 'order.orderStatus': 'complete' }, { 'order.customerId': ?0, 'order.orderStatus': 'pending' } ] } }"
    })
    List<Ticket> findAllTicketsFilterAll(String userId, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { $or: [{ 'order.customerId': ?0, 'order.orderStatus': 'complete' }, { 'order.customerId': ?0, 'order.orderStatus': 'pending' } ] } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countTicketsFilterAll(String userId);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gt: ?1 }} }",
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'complete' } }"
    })
    List<Ticket> findAllTicketsFilterActive(String userId, LocalDateTime currentDate, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $lt: ?1 }} }",
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'complete' } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countTicketsFilterExpired(String userId, LocalDateTime currentDate);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $lte: ?1 }} }",
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'complete' } }"
    })
    List<Ticket> findAllTicketsFilterExpired(String userId, LocalDateTime currentDate, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?1 }} }",
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'complete' } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countTicketsFilterActive(String userId, LocalDateTime currentDate);

    @Aggregation(pipeline = {
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'pending' } }"
    })
    List<Ticket> findAllTicketsFilterUnpaid(String userId, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': 'pending' } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countTicketsFilterUnpaid(String userId);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?2 }}}",
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus':  ?1 } }"
    })
    List<Ticket> findPaidTicketsByUserId(String userId, String orderStatus, LocalDateTime date, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'date': { $gte: ?2 }}}",
            "{ '$addFields': { orderIdAsObjectId: { $toObjectId: \"$orderId\" }} }",
            "{ '$lookup': { 'from': 'order', 'localField': 'orderIdAsObjectId', 'foreignField': '_id', 'as': 'order' } }",
            "{ '$unwind': '$order' }",
            "{ '$match': { 'order.customerId': ?0, 'order.orderStatus': ?1 } }",
            "{ '$count': \"totalTicket\"}"
    })
    Integer countPaidTicketsByUserId(String userId, String orderStatus, LocalDateTime date);

    List<Ticket> findAllByOrderId(String orderId);

    List<Ticket> findAllByShowingId(int showingId);

    Page<Ticket> findALlByUserId(String userId, Pageable pageable);
    Page<Ticket> findALlByUserIdAndStatus(String userId, String status, Pageable pageable);
    Page<Ticket> findAllByUserIdAndDateAfter(String userId, LocalDateTime date, Pageable pageable);
    Page<Ticket> findAllByUserIdAndDateBefore(String userId, LocalDateTime date, Pageable pageable);
}
