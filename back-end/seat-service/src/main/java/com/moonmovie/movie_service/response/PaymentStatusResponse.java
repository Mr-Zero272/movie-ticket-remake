package com.moonmovie.movie_service.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentStatusResponse {
    private String provider;
    private String invoiceId;
    private String status;
}
