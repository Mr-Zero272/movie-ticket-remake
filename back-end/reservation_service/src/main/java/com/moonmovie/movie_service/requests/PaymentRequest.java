package com.moonmovie.movie_service.requests;

import lombok.Data;

@Data
public class PaymentRequest {
    private String orderId;
    private String invoiceId;
    private int total;
    private String paymentStatus;
    private String method;
    private String description;
    private String customerEmail;
}
