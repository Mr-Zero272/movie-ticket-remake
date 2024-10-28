package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.models.Order;
import com.moonmovie.movie_service.models.OrderStatisticalDetail;
import com.moonmovie.movie_service.requests.OrderRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v2/moon-movie/reservation/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> addNewOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.addNewOrder(request));
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<Order>> fetchOrders(
            @RequestParam(value = "orderStatus", defaultValue = "complete") String orderStatus,
            @RequestParam(value = "sort", defaultValue = "none", required = false) String sort,
            @RequestParam(value = "sortOrder", defaultValue = "asc", required = false) String sortOrder,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(orderService.getOrders(orderStatus, sort, sortOrder, page, size));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> fetchOrdersById(
            @PathVariable("orderId") String orderId
    ) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/statistical")
    public ResponseEntity<List<OrderStatisticalDetail>> getOrderStatistics(
            @RequestParam(value = "year", defaultValue = "2024") Integer year
    ) {
        return ResponseEntity.ok(orderService.getOrderStatistics(year));
    }
}
