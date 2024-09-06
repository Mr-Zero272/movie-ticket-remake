package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.models.Order;
import com.moonmovie.movie_service.requests.OrderRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(orderService.getOrders(page, size));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<PaginationResponse<Order>> fetchOrdersByCustomer(
            @PathVariable("customerId") String customerId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(orderService.getOrders(page, size));
    }
}
