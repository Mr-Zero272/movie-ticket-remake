package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Order;
import com.moonmovie.movie_service.requests.OrderRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;

public interface OrderService {
    public Order addNewOrder(OrderRequest request);
    public PaginationResponse<Order> getOrders(int page, int size);
}
