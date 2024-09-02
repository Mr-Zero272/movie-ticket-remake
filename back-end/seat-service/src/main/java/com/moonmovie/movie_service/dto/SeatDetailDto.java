package com.moonmovie.movie_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeatDetailDto {
    private String id;
    private int seatNumber;
    private String seatRow;
    private int price;
    private String hall;
    private String address;
}
