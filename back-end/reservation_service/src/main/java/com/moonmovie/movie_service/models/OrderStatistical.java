package com.moonmovie.movie_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatistical {
    private long totalAmount;
    private long totalServiceFee;
    private int month;
}
