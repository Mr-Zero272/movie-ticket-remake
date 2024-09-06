package com.moonmovie.movie_service.responses;

import lombok.Data;

@Data
public class PaymentMethodResponse {
    private String method;
    private String urlPayment;
}
