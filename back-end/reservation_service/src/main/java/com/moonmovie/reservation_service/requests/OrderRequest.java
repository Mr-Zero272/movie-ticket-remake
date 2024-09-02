package com.moonmovie.reservation_service.requests;

import lombok.Data;

@Data
public class OrderRequest {
    private String customerId;
    private Integer showingId;
}
