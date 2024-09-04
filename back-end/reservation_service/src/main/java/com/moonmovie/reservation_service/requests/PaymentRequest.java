package com.moonmovie.reservation_service.requests;

import lombok.Data;

@Data
public class PaymentRequest {
    private String orderId;
    private String invoiceId;
    private int total;
    private int paymentStatus;
    private String method;
    private String description;
}
