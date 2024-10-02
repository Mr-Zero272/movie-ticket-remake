package com.moonmovie.movie_service.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticalDetail {
    private int year;
    private List<OrderStatistical> orderStatisticalList;
}
