package com.moonmovie.movie_service.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodRequest {
    private String orderId;
    private String userId;
    private String method;
    private int amount;
    private String description;
    private String returnUrl;
    private String transactionId;
}
