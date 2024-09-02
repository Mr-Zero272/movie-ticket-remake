package com.moonmovie.reservation_service.services;

import com.moonmovie.reservation_service.models.Order;
import com.moonmovie.reservation_service.requests.OrderRequest;
import com.moonmovie.reservation_service.responses.PaginationResponse;

public interface OrderService {
    public Order addNewOrder(OrderRequest request);
    public PaginationResponse<Order> getOrders(int page, int size);
}
