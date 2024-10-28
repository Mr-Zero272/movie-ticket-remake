package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Order;
import com.moonmovie.movie_service.models.OrderStatisticalDetail;
import com.moonmovie.movie_service.requests.OrderRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;

import java.util.List;

public interface OrderService {
    Order addNewOrder(OrderRequest request);
    PaginationResponse<Order> getOrders(String orderStatus, String sort, String sortOrder, int page, int size);
    List<OrderStatisticalDetail> getOrderStatistics(int year);

    Order getOrderById(String orderId);
}
