package com.moonmovie.reservation_service.responses;

import lombok.Data;

@Data
public class PaymentMethodResponse {
    private String method;
    private String urlPayment;
}
