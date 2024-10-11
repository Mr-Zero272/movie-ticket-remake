package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Order;
import com.moonmovie.movie_service.models.OrderStatistical;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDao extends MongoRepository<Order, String> {
    Page<Order> findAllByOrderStatus(String orderStatus, Pageable pageable);

    @Aggregation({"{ $project: { month: { $month: \"$timestamp\" }, year: {$year: \"$timestamp\"}, amount: 1, serviceFee: 1, customerId: 1, orderStatus: 1 }}",
            "{ $match: { year: ?0 }}",
            "{ $group: { _id: { month: \"$month\"}, totalAmount: { $sum: \"$amount\" }, totalServiceFee: { $sum: \"$serviceFee\" }, totalOrders: { $sum: 1 }}}",
            "{ $sort: { \"_id.month\": 1} }",
            "{ $project: { _id: 0, month: \"$_id.month\", totalAmount: 1, totalServiceFee: 1, totalOrders: 1}}",
            "{ $limit: 12 }"})
    List<OrderStatistical> getOrderStatisticalByYear(int year);
}
