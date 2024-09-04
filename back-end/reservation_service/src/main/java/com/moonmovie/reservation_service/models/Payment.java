package com.moonmovie.reservation_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment {
    private String invoiceId;
    private int total;
    private int paymentStatus;
    private String method;
    private String description;
    private LocalDateTime timestamp;
}
