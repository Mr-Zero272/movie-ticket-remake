package com.moonmovie.reservation_service.requests;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderRequest {
    private String customerId;
    private Integer showingId;
    private LocalDateTime showingTime;
}
